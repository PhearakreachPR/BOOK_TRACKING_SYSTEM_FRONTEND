import { writable } from 'svelte/store';

export const shelvesStore = writable([
  {
    id: 1,
    shelfCode: "S-001",
    location: "Ground Floor",
    category: "Fiction",
    capacity: 50,
    booksCount: 45,
    lastAuditDate: "2026-01-10",
    qrCode: ""
  },
  {
    id: 2,
    shelfCode: "S-002",
    location: "Ground Floor",
    category: "Non-Fiction",
    capacity: 50,
    booksCount: 48,
    lastAuditDate: "2026-01-08",
    qrCode: ""
  },
  {
    id: 3,
    shelfCode: "S-003",
    location: "Ground Floor",
    category: "Reference",
    capacity: 40,
    booksCount: 38,
    lastAuditDate: "2026-01-12",
    qrCode: ""
  },
  {
    id: 4,
    shelfCode: "S-004",
    location: "First Floor",
    category: "Science",
    capacity: 50,
    booksCount: 42,
    lastAuditDate: "2026-01-05",
    qrCode: ""
  },
  {
    id: 5,
    shelfCode: "S-005",
    location: "First Floor",
    category: "History",
    capacity: 50,
    booksCount: 50,
    lastAuditDate: "2026-01-11",
    qrCode: ""
  },
  {
    id: 6,
    shelfCode: "S-006",
    location: "Second Floor",
    category: "Technology",
    capacity: 45,
    booksCount: 25,
    lastAuditDate: "2026-01-03",
    qrCode: ""
  }
]);
