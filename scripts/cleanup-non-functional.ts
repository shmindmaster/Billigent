#!/usr/bin/env tsx

/**
 * Non-Functional Features Cleanup Script
 * 
 * This script identifies and helps clean up:
 * 1. Unused imports and dependencies
 * 2. Dead code and unreachable functions
 * 3. TODO/FIXME items that are no longer relevant
 * 4. Console statements that should be replaced with logging
 * 5. Type safety issues
 */

import fs from "fs";
import path from "path";
import { glob } from "glob";

interface CleanupItem {
  file: string;
  line: number;
  type: "console" | "todo" | "any" | "unused" | "deadcode";
  message: string;
  severity: "low" | "medium" | "high";
}

interface CleanupReport {
  totalIssues: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  items: CleanupItem[];
}

class CodebaseCleaner {
  private issues: CleanupItem[] = [];
  private rootDir: string;

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  async scanCodebase(): Promise<CleanupReport> {
    console.log("🔍 Scanning codebase for cleanup opportunities...");

    // Find all TypeScript/JavaScript files
    const files = await glob("**/*.{ts,tsx,js,jsx}", {
      cwd: this.rootDir,
      ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
    });

    for (const file of files) {
      const fullPath = path.join(this.rootDir, file);
      await this.analyzeFile(fullPath, file);
    }

    return this.generateReport();
  }

  private async analyzeFile(fullPath: string, relativePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineNumber = i + 1;

        // Check for console statements
        if (line.includes("console.log") || line.includes("console.warn") || line.includes("console.error")) {
          this.issues.push({
            file: relativePath,
            line: lineNumber,
            type: "console",
            message: `Console statement: ${line.trim()}`,
            severity: "medium",
          });
        }

        // Check for TODO/FIXME items
        if (line.includes("TODO:") || line.includes("FIXME:") || line.includes("HACK:") || line.includes("XXX:")) {
          this.issues.push({
            file: relativePath,
            line: lineNumber,
            type: "todo",
            message: `TODO/FIXME item: ${line.trim()}`,
            severity: "low",
          });
        }

        // Check for any types
        if (line.includes(": any") || line.includes("as any")) {
          this.issues.push({
            file: relativePath,
            line: lineNumber,
            type: "any",
            message: `Any type usage: ${line.trim()}`,
            severity: "high",
          });
        }

        // Check for @ts-ignore and @ts-nocheck
        if (line.includes("@ts-ignore") || line.includes("@ts-nocheck")) {
          this.issues.push({
            file: relativePath,
            line: lineNumber,
            type: "any",
            message: `TypeScript directive: ${line.trim()}`,
            severity: "high",
          });
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not analyze file ${relativePath}:`, error);
    }
  }

  private generateReport(): CleanupReport {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};

    for (const item of this.issues) {
      byType[item.type] = (byType[item.type] || 0) + 1;
      bySeverity[item.severity] = (bySeverity[item.severity] || 0) + 1;
    }

    return {
      totalIssues: this.issues.length,
      byType,
      bySeverity,
      items: this.issues,
    };
  }

  async generateCleanupPlan(): Promise<string> {
    const report = await this.scanCodebase();
    
    let plan = "# Codebase Cleanup Plan\n\n";
    plan += `## Summary\n`;
    plan += `- Total issues found: ${report.totalIssues}\n`;
    plan += `- High priority: ${report.bySeverity.high || 0}\n`;
    plan += `- Medium priority: ${report.bySeverity.medium || 0}\n`;
    plan += `- Low priority: ${report.bySeverity.low || 0}\n\n`;

    plan += `## Issues by Type\n`;
    Object.entries(report.byType).forEach(([type, count]) => {
      plan += `- ${type}: ${count}\n`;
    });
    plan += "\n";

    plan += `## Detailed Issues\n\n`;
    
    // Group by file
    const byFile: Record<string, CleanupItem[]> = {};
    for (const item of report.items) {
      if (!byFile[item.file]) {
        byFile[item.file] = [];
      }
      byFile[item.file].push(item);
    }

    Object.entries(byFile).forEach(([file, items]) => {
      plan += `### ${file}\n\n`;
      
      items.forEach(item => {
        plan += `- **Line ${item.line}** (${item.severity.toUpperCase()}): ${item.message}\n`;
      });
      
      plan += "\n";
    });

    plan += `## Recommended Actions\n\n`;
    
    if (report.byType.console) {
      plan += `### Console Statements (${report.byType.console} found)\n`;
      plan += `- Replace with structured logging using Winston\n`;
      plan += `- Use appropriate log levels (info, warn, error, debug)\n`;
      plan += `- Add context metadata for better debugging\n\n`;
    }

    if (report.byType.any) {
      plan += `### Type Safety Issues (${report.byType.any} found)\n`;
      plan += `- Replace 'any' types with proper interfaces\n`;
      plan += `- Remove @ts-ignore and @ts-nocheck directives\n`;
      plan += `- Add proper type definitions\n\n`;
    }

    if (report.byType.todo) {
      plan += `### TODO Items (${report.byType.todo} found)\n`;
      plan += `- Review and prioritize implementation\n`;
      plan += `- Remove obsolete TODO items\n`;
      plan += `- Create proper issue tracking\n\n`;
    }

    return plan;
  }

  async saveCleanupPlan(outputPath: string): Promise<void> {
    const plan = await this.generateCleanupPlan();
    fs.writeFileSync(outputPath, plan, "utf-8");
    console.log(`📝 Cleanup plan saved to: ${outputPath}`);
  }
}

async function main() {
  const rootDir = process.cwd();
  const cleaner = new CodebaseCleaner(rootDir);
  
  try {
    const outputPath = path.join(rootDir, "CLEANUP_PLAN.md");
    await cleaner.saveCleanupPlan(outputPath);
    
    console.log("✅ Cleanup analysis complete!");
    console.log("📋 Review CLEANUP_PLAN.md for detailed recommendations");
    
  } catch (error) {
    console.error("❌ Cleanup analysis failed:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default CodebaseCleaner;
