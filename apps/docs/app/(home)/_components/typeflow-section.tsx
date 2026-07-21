"use client";

import { useState } from "react";
import { Code2, FileCode2, Globe, Server, ArrowRight } from "lucide-react";
import { CopyButton } from "./copy-button";
import { Reveal } from "./reveal";

interface LayerData {
  layerNum: string;
  badge: string;
  title: string;
  file: string;
  desc: string;
  icon: typeof Code2;
  code: string;
  lines: Array<{
    num: number;
    tokens: Array<{
      text: string;
      color?: string;
      bold?: boolean;
      italic?: boolean;
    }>;
  }>;
}

const TYPE_LAYERS: Record<string, LayerData> = {
  schema: {
    layerNum: "01",
    badge: "packages/contracts",
    title: "1. Shared Zod Contract",
    file: "packages/contracts/src/auth.contract.ts",
    desc: "Define your Zod schemas and TypeScript models once in the shared contracts package.",
    icon: Code2,
    code: `import { z } from "zod";

export const CreateUserRequest = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().min(2, "Name must be at least 2 chars"),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export type CreateUserInput = z.infer<typeof CreateUserRequest>;
export type UserResponse = { id: string; email: string; name: string | null };`,
    lines: [
      {
        num: 1,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { z } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "zod"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      { num: 2, tokens: [] },
      {
        num: 3,
        tokens: [
          { text: "export const", color: "text-purple-400" },
          { text: " CreateUserRequest", color: "text-blue-400 bold" },
          { text: " = z.object({" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "  email: z.string().email(" },
          { text: '"Valid email required"', color: "text-emerald-400" },
          { text: ")," },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  name: z.string().min(" },
          { text: "2", color: "text-amber-400" },
          { text: ", " },
          {
            text: '"Name must be at least 2 chars"',
            color: "text-emerald-400",
          },
          { text: ")," },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "  role: z.enum([" },
          { text: '"USER"', color: "text-emerald-400" },
          { text: ", " },
          { text: '"ADMIN"', color: "text-emerald-400" },
          { text: "]).default(" },
          { text: '"USER"', color: "text-emerald-400" },
          { text: ")," },
        ],
      },
      { num: 7, tokens: [{ text: "});" }] },
      { num: 8, tokens: [] },
      {
        num: 9,
        tokens: [
          { text: "export type", color: "text-purple-400" },
          { text: " CreateUserInput", color: "text-cyan-400 bold" },
          { text: " = z.infer<typeof CreateUserRequest>;" },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "export type", color: "text-purple-400" },
          { text: " UserResponse", color: "text-cyan-400 bold" },
          { text: " = { id: string; email: string; name: string | null };" },
        ],
      },
    ],
  },
  express: {
    layerNum: "02",
    badge: "apps/api",
    title: "2. Express Route Validation",
    file: "apps/api/src/routes/user.routes.ts",
    desc: "Express route validates incoming HTTP request body with zero manual type assertions.",
    icon: Server,
    code: `import { Router } from "express";
import { CreateUserRequest, UserResponse } from "@workspace/contracts";
import { validateBody } from "../middleware/validate";
import { db } from "@workspace/db";

const router = Router();

router.post("/users", validateBody(CreateUserRequest), async (req, res) => {
  // req.body is fully typed and validated at runtime!
  const user = await db.user.create({ data: req.body });
  res.status(201).json<UserResponse>(user);
});`,
    lines: [
      {
        num: 1,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { Router } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "express"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { CreateUserRequest, UserResponse } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "@workspace/contracts"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      {
        num: 3,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { validateBody } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "../middleware/validate"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      {
        num: 4,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { db } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "@workspace/db"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      { num: 5, tokens: [] },
      {
        num: 6,
        tokens: [
          { text: "const", color: "text-purple-400" },
          { text: " router = Router();" },
        ],
      },
      { num: 7, tokens: [] },
      {
        num: 8,
        tokens: [
          { text: "router.post(" },
          { text: '"/users"', color: "text-emerald-400" },
          { text: ", validateBody(CreateUserRequest), " },
          { text: "async", color: "text-purple-400" },
          { text: " (req, res) => {" },
        ],
      },
      {
        num: 9,
        tokens: [
          {
            text: "  // req.body is fully typed and validated at runtime!",
            color: "text-muted-foreground italic",
          },
        ],
      },
      {
        num: 10,
        tokens: [
          { text: "  const", color: "text-purple-400" },
          { text: " user = " },
          { text: "await", color: "text-purple-400" },
          { text: " db.user.create({ data: req.body });" },
        ],
      },
      {
        num: 11,
        tokens: [
          { text: "  res.status(" },
          { text: "201", color: "text-amber-400" },
          { text: ").json<" },
          { text: "UserResponse", color: "text-cyan-400" },
          { text: ">(user);" },
        ],
      },
      { num: 12, tokens: [{ text: "});" }] },
    ],
  },
  react: {
    layerNum: "03",
    badge: "apps/web",
    title: "3. Next.js 16 Client Hook",
    file: "apps/web/hooks/use-create-user.ts",
    desc: "Next.js React 19 client hook consumes the API with full auto-completion and type safety.",
    icon: Globe,
    code: `"use client";
import { CreateUserInput, UserResponse } from "@workspace/contracts";

export function useCreateUser() {
  const createUser = async (payload: CreateUserInput): Promise<UserResponse> => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  };
  return { createUser };
}`,
    lines: [
      {
        num: 1,
        tokens: [
          { text: '"use client"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      {
        num: 2,
        tokens: [
          { text: "import", color: "text-purple-400" },
          { text: " { CreateUserInput, UserResponse } " },
          { text: "from", color: "text-purple-400" },
          { text: ' "@workspace/contracts"', color: "text-emerald-400" },
          { text: ";" },
        ],
      },
      { num: 3, tokens: [] },
      {
        num: 4,
        tokens: [
          { text: "export function", color: "text-purple-400" },
          { text: " useCreateUser() {" },
        ],
      },
      {
        num: 5,
        tokens: [
          { text: "  const", color: "text-purple-400" },
          { text: " createUser = " },
          { text: "async", color: "text-purple-400" },
          { text: " (payload: " },
          { text: "CreateUserInput", color: "text-cyan-400" },
          { text: "): " },
          { text: "Promise", color: "text-cyan-400" },
          { text: "<" },
          { text: "UserResponse", color: "text-cyan-400" },
          { text: "> => {" },
        ],
      },
      {
        num: 6,
        tokens: [
          { text: "    const", color: "text-purple-400" },
          { text: " res = " },
          { text: "await", color: "text-purple-400" },
          { text: " fetch(" },
          { text: '"/api/users"', color: "text-emerald-400" },
          { text: ", {" },
        ],
      },
      {
        num: 7,
        tokens: [
          { text: "      method: " },
          { text: '"POST"', color: "text-emerald-400" },
          { text: "," },
        ],
      },
      {
        num: 8,
        tokens: [
          { text: "      headers: { " },
          { text: '"Content-Type"', color: "text-emerald-400" },
          { text: ": " },
          { text: '"application/json"', color: "text-emerald-400" },
          { text: " }," },
        ],
      },
      { num: 9, tokens: [{ text: "      body: JSON.stringify(payload)," }] },
      { num: 10, tokens: [{ text: "    });" }] },
      {
        num: 11,
        tokens: [
          { text: "    return", color: "text-purple-400" },
          { text: " res.json();" },
        ],
      },
      { num: 12, tokens: [{ text: "  };" }] },
      {
        num: 13,
        tokens: [
          { text: "  return", color: "text-purple-400" },
          { text: " { createUser };" },
        ],
      },
      { num: 14, tokens: [{ text: "}" }] },
    ],
  },
};

type LayerKey = "schema" | "express" | "react";

export function TypeFlowSection() {
  const [activeLayer, setActiveLayer] = useState<LayerKey>("schema");
  const current = TYPE_LAYERS[activeLayer];

  return (
    <section className="border-t border-border/40 py-24">
      <div className="mx-auto max-w-5xl px-4 space-y-12">
        <Reveal>
          <span className="inline-block font-mono text-xs font-medium uppercase tracking-widest text-primary">
            [ End-to-End Type Safety ]
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Interactive TypeFlow architecture trace
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A single schema in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-foreground font-mono">
              packages/contracts
            </code>{" "}
            flows unbroken from database models to Express API validation and
            Next.js React hooks.
          </p>
        </Reveal>

        {/* Pipeline Step Switcher */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(TYPE_LAYERS) as LayerKey[]).map((key) => {
              const layer = TYPE_LAYERS[key];
              const Icon = layer.icon;
              const isActive = activeLayer === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveLayer(key)}
                  className={`group relative flex items-center justify-between rounded-xl border p-4 text-left font-mono transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-primary/60 bg-card shadow-lg shadow-primary/5 ring-1 ring-primary/30"
                      : "border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-2 transition-colors ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <span
                        className={`block text-[10px] font-medium tracking-wider uppercase ${
                          isActive
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        Layer {layer.layerNum}
                      </span>
                      <span
                        className={`mt-0.5 block text-xs font-semibold transition-colors ${
                          isActive
                            ? "text-foreground font-bold"
                            : "text-foreground/80 group-hover:text-foreground"
                        }`}
                      >
                        {layer.title.replace(/^\d+\.\s*/, "")}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    className={`size-3.5 transition-transform ${
                      isActive
                        ? "text-primary translate-x-0.5"
                        : "text-muted-foreground/40 group-hover:text-muted-foreground group-hover:translate-x-0.5"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* IDE Code Editor Window */}
        <Reveal delay={0.1}>
          <div className="relative">
            {/* Ambient subtle glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl"
            />
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur font-mono text-xs">
              {/* Window Header Bar */}
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-400/80" />
                  <span className="size-3 rounded-full bg-amber-400/80" />
                  <span className="size-3 rounded-full bg-emerald-400/80" />
                  <div className="ml-2 flex items-center gap-2.5 text-xs text-muted-foreground">
                    <span className="rounded-md border border-border/60 bg-muted/80 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {current.badge}
                    </span>
                    <span className="hidden items-center gap-1.5 text-muted-foreground sm:inline-flex">
                      <FileCode2 className="size-3.5 text-muted-foreground shrink-0" />
                      <span>{current.file}</span>
                    </span>
                  </div>
                </div>
                <CopyButton value={current.code} />
              </div>

              {/* Description callout strip */}
              <div className="border-b border-border/40 bg-muted/20 px-5 py-2.5 text-[11px] text-muted-foreground">
                <span className="text-foreground font-semibold mr-1.5">
                  Context:
                </span>
                {current.desc}
              </div>

              {/* Code Content with Line Numbers and Syntax Highlighting */}
              <div className="overflow-x-auto p-5 leading-relaxed">
                <div className="table w-full">
                  {current.lines.map((line) => (
                    <div key={line.num} className="table-row">
                      <span className="table-cell select-none pr-4 text-right text-[11px] text-muted-foreground/40 w-8">
                        {line.num}
                      </span>
                      <span className="table-cell whitespace-pre">
                        {line.tokens.length === 0 ? (
                          <span>&nbsp;</span>
                        ) : (
                          line.tokens.map((token, i) => (
                            <span
                              key={i}
                              className={token.color || "text-foreground"}
                            >
                              {token.text}
                            </span>
                          ))
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
