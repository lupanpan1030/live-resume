import { NextResponse } from "next/server";
import {
  contact,
  education,
  experience,
  profile,
  projects,
  site,
  skills,
} from "@/content";
import { isAuthed } from "@/lib/auth";
import {
  contentSectionNames,
  contentStore,
  type ContentSectionMap,
  type ContentSectionName,
} from "@/lib/store";

type RouteContext = {
  params: Promise<{
    section: string;
  }>;
};

const defaultSections = {
  contact,
  education,
  experience,
  profile,
  projects,
  site,
  skills,
} satisfies ContentSectionMap;

const sectionNameSet = new Set<string>(contentSectionNames);

function isContentSectionName(value: string): value is ContentSectionName {
  return sectionNameSet.has(value);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function hasSameKeys(
  value: Record<string, unknown>,
  shape: Record<string, unknown>
) {
  const valueKeys = Object.keys(value).sort();
  const shapeKeys = Object.keys(shape).sort();

  return (
    valueKeys.length === shapeKeys.length &&
    valueKeys.every((key, index) => key === shapeKeys[index])
  );
}

function matchesShape(value: unknown, shape: unknown): boolean {
  if (Array.isArray(shape)) {
    if (!Array.isArray(value)) {
      return false;
    }

    if (shape.length === 0) {
      return true;
    }

    return value.every((item) => matchesShape(item, shape[0]));
  }

  if (isPlainObject(shape)) {
    if (!isPlainObject(value) || !hasSameKeys(value, shape)) {
      return false;
    }

    return Object.entries(shape).every(([key, childShape]) =>
      matchesShape(value[key], childShape)
    );
  }

  if (shape === null) {
    return value === null;
  }

  return typeof value === typeof shape;
}

async function readBody(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized", ok: false }, { status: 401 });
  }

  const { section } = await params;

  if (!isContentSectionName(section)) {
    return NextResponse.json({ error: "Unknown section", ok: false }, { status: 404 });
  }

  const body = await readBody(request);

  if (!matchesShape(body, defaultSections[section])) {
    return NextResponse.json({ error: "Invalid content shape", ok: false }, { status: 400 });
  }

  await contentStore.saveSection(section, body as ContentSectionMap[typeof section]);

  return NextResponse.json({ ok: true });
}
