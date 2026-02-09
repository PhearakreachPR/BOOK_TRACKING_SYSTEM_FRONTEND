import { writable } from 'svelte/store';

export const tablesStore = writable([
  {
    id: 1,
    tableNumber: "T-001",
    status: "Available",
    qrCode: ""
  },
  {
    id: 2,
    tableNumber: "T-002",
    status: "Available",
    qrCode: ""
  },
  {
    id: 3,
    tableNumber: "T-003",
    status: "Occupied",
    qrCode: ""
  },
  {
    id: 4,
    tableNumber: "T-004",
    status: "Available",
    qrCode: ""
  },
  {
    id: 5,
    tableNumber: "T-005",
    status: "Occupied",
    qrCode: ""
  },
  {
    id: 6,
    tableNumber: "T-006",
    status: "Available",
    qrCode: ""
  }
]);
