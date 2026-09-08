import { Ticket } from "./types/ticket";

// Simple in-memory store - replace with a DB adapter in a real service
class TicketStore {
  // JavaScript Map - uses ticket id as key, Ticket object as value. Faster lookups than an array
  private tickets: Map<string, Ticket> = new Map(); // private - only accessible inside the class
  findAll(status?: string): Ticket[] {
    const all = Array.from(this.tickets.values());
    if (status) {
      return all.filter((t) => t.status === status);
    }
    return all;
  }

  findById(id: string): Ticket | undefined {
    return this.tickets.get(id);
  }

  create(ticketData: Ticket): Ticket {
    this.tickets.set(ticketData.id, ticketData);
    return ticketData;
  }

  // a built-in TypeScript utility type meaning "an object with any subset of Ticket's fields".
  // Perfect for PATCH updates where not every field is required
  update(id: string, updates: Partial<Ticket>): Ticket | undefined {
    const existing = this.tickets.get(id);
    if (!existing) return undefined;
    // spread operator merges the existing ticket with the incoming updates, with updates winning on any clashing fields
    const updated: Ticket = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    this.tickets.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tickets.delete(id);
  }

  // Test helper - reset state between tests - only exists for tests.
  clear(): void {
    this.tickets.clear();
  }
}

export const ticketStore = new TicketStore();
