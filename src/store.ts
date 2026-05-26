import { Case } from "./types/case";

// Simple in-memory store - replace with a DB adapter in a real service
class CaseStore {
  // JavaScript Map - uses case id as key, Case object as value. Faster lookups than an array
  private cases: Map<string, Case> = new Map(); // private - only accessible inside the class
  findAll(status?: string): Case[] {
    const all = Array.from(this.cases.values());
    if (status) {
      return all.filter((c) => c.status === status);
    }
    return all;
  }

  findById(id: string): Case | undefined {
    return this.cases.get(id);
  }

  create(caseData: Case): Case {
    this.cases.set(caseData.id, caseData);
    return caseData;
  }

  // a built-in TypeScript utility type meaning "an object with any subset of Case's fields".
  // Perfect for PATCH updates where not every field is required
  update(id: string, updates: Partial<Case>): Case | undefined {
    const existing = this.cases.get(id);
    if (!existing) return undefined;
    // spread operator merges the existing case with the incoming updates, with updates winning on any clashing fields
    const updated: Case = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.cases.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.cases.delete(id);
  }

  // Test helper - reset state between tests - only exists for tests.
  clear(): void {
    this.cases.clear();
  }
}

export const caseStore = new CaseStore();
