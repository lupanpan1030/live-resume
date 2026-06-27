import { Redis } from "@upstash/redis";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "redis";
import contactJson from "../../content/contact.json";
import educationJson from "../../content/education.json";
import experienceJson from "../../content/experience.json";
import profileJson from "../../content/profile.json";
import projectsJson from "../../content/projects.json";
import skillsJson from "../../content/skills.json";
import siteJson from "../../content/site.json";
import type {
  ContactContent,
  EducationContent,
  ExperienceContent,
  ProfileContent,
  ProjectsContent,
  SiteContent,
  SkillsContent,
} from "@/content";

export const contentSectionNames = [
  "site",
  "profile",
  "skills",
  "experience",
  "projects",
  "education",
  "contact",
] as const;

export type ContentSectionName = (typeof contentSectionNames)[number];

export type ContentSectionMap = {
  contact: ContactContent;
  education: EducationContent;
  experience: ExperienceContent;
  profile: ProfileContent;
  projects: ProjectsContent;
  site: SiteContent;
  skills: SkillsContent;
};

export type StoredResumeContent = {
  [Name in ContentSectionName]: ContentSectionMap[Name];
};

export interface ContentStore {
  getContent(): Promise<StoredResumeContent>;
  getSection<Name extends ContentSectionName>(
    name: Name
  ): Promise<ContentSectionMap[Name]>;
  saveSection<Name extends ContentSectionName>(
    name: Name,
    data: ContentSectionMap[Name]
  ): Promise<void>;
}

const defaultSections = {
  contact: contactJson satisfies ContactContent,
  education: educationJson satisfies EducationContent,
  experience: experienceJson satisfies ExperienceContent,
  profile: profileJson satisfies ProfileContent,
  projects: projectsJson satisfies ProjectsContent,
  site: siteJson satisfies SiteContent,
  skills: skillsJson satisfies SkillsContent,
} satisfies StoredResumeContent;

function cloneSection<Name extends ContentSectionName>(
  section: ContentSectionMap[Name]
): ContentSectionMap[Name] {
  return structuredClone(section);
}

async function readAllSections(
  getSection: <Name extends ContentSectionName>(
    name: Name
  ) => Promise<ContentSectionMap[Name]>
): Promise<StoredResumeContent> {
  const entries = await Promise.all(
    contentSectionNames.map(async (name) => [name, await getSection(name)] as const)
  );

  return Object.fromEntries(entries) as StoredResumeContent;
}

function createTcpRedisClient(redisUrl: string) {
  const client = createClient({ url: redisUrl });

  client.on("error", () => {
    // Keep the process from treating Redis connection errors as unhandled events.
  });

  return client;
}

type TcpRedisClient = ReturnType<typeof createTcpRedisClient>;

let tcpRedisClient: TcpRedisClient | null = null;
let tcpRedisConnectPromise: Promise<TcpRedisClient> | null = null;

async function getTcpRedisClient(redisUrl: string) {
  if (tcpRedisClient?.isOpen) {
    return tcpRedisClient;
  }

  if (!tcpRedisClient) {
    tcpRedisClient = createTcpRedisClient(redisUrl);
  }

  const client = tcpRedisClient;

  tcpRedisConnectPromise ??= client
    .connect()
    .then(() => client)
    .catch((error: unknown) => {
      tcpRedisClient = null;
      tcpRedisConnectPromise = null;
      throw error;
    });

  return tcpRedisConnectPromise;
}

class FileSystemContentStore implements ContentStore {
  private readonly contentDir: string;

  constructor(contentDir = path.join(process.cwd(), "content")) {
    this.contentDir = contentDir;
  }

  async getContent(): Promise<StoredResumeContent> {
    return readAllSections((name) => this.getSection(name));
  }

  async getSection<Name extends ContentSectionName>(
    name: Name
  ): Promise<ContentSectionMap[Name]> {
    const filePath = path.join(this.contentDir, `${name}.json`);
    const raw = await readFile(filePath, "utf8");

    return JSON.parse(raw) as ContentSectionMap[Name];
  }

  async saveSection<Name extends ContentSectionName>(
    name: Name,
    data: ContentSectionMap[Name]
  ): Promise<void> {
    const filePath = path.join(this.contentDir, `${name}.json`);
    await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }
}

class UpstashRedisContentStore implements ContentStore {
  private readonly keyPrefix = "live-resume:content";
  private readonly redis: Redis;

  constructor(redis = Redis.fromEnv()) {
    this.redis = redis;
  }

  async getContent(): Promise<StoredResumeContent> {
    return readAllSections((name) => this.getSection(name));
  }

  async getSection<Name extends ContentSectionName>(
    name: Name
  ): Promise<ContentSectionMap[Name]> {
    const value = await this.redis.get<ContentSectionMap[Name]>(this.key(name));

    return value ?? cloneSection(defaultSections[name]);
  }

  async saveSection<Name extends ContentSectionName>(
    name: Name,
    data: ContentSectionMap[Name]
  ): Promise<void> {
    await this.redis.set(this.key(name), data);
  }

  private key(name: ContentSectionName) {
    return `${this.keyPrefix}:${name}`;
  }
}

class TcpRedisContentStore implements ContentStore {
  private readonly keyPrefix = "live-resume:content";
  private readonly redisUrl: string;

  constructor(redisUrl: string) {
    this.redisUrl = redisUrl;
  }

  async getContent(): Promise<StoredResumeContent> {
    return readAllSections((name) => this.getSection(name));
  }

  async getSection<Name extends ContentSectionName>(
    name: Name
  ): Promise<ContentSectionMap[Name]> {
    const client = await getTcpRedisClient(this.redisUrl);
    const value = await client.get(this.key(name));

    return value
      ? (JSON.parse(value) as ContentSectionMap[Name])
      : cloneSection(defaultSections[name]);
  }

  async saveSection<Name extends ContentSectionName>(
    name: Name,
    data: ContentSectionMap[Name]
  ): Promise<void> {
    const client = await getTcpRedisClient(this.redisUrl);

    await client.set(this.key(name), JSON.stringify(data));
  }

  private key(name: ContentSectionName) {
    return `${this.keyPrefix}:${name}`;
  }
}

export function createContentStore(): ContentStore {
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return new UpstashRedisContentStore();
  }

  if (process.env.REDIS_URL) {
    return new TcpRedisContentStore(process.env.REDIS_URL);
  }

  return new FileSystemContentStore();
}

export const contentStore = createContentStore();
