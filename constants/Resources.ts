export const DATA = [
  { id: "collections", title: "Collections" },
  { id: "widthrawals", title: "Widthdrawals" },
  { id: "accounts", title: "Member Accounts" },
  { id: "passbooks", title: "Passbooks" },
  { id: "associations", title: "Associations" },
  { id: "communities", title: "Communities" },
  { id: "offices", title: "Cluster Offices" },
  { id: "farms", title: "Farm Lands" },
];

export const ACTYPES = [
  { id: "dues", name: "Dues" },
  { id: "savings", name: "Savings" },
  { id: "loans", name: "Loans" },
  { id: "shares", name: "Shares" },
];
export const ACCOUNT_DATA = [
  {
    id: "1234",
    name: "Joyce Mensah",
    given_name: "Eric",
    family_name: "Mensah",
    sex: "Female",
    primary_phone: "0123456789",
    date_joined: "01/01/2024",
    associations: ["a1", "b1"],
    photo: null,
  },
  {
    id: "5678",
    name: "Michael Johnson",
    given_name: "Michael",
    family_name: "Johnson",
    sex: "Male",
    primary_phone: "0987654321",
    date_joined: "02/05/2024",
    associations: ["c2"],
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2345",
    name: "Alice Brown",
    given_name: "Alice",
    family_name: "Brown",
    sex: "Female",
    primary_phone: "1234567890",
    date_joined: "03/15/2024",
    associations: ["a1", "d4"],
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: "6789",
    name: "John Smith",
    given_name: "John",
    family_name: "Smith",
    sex: "Male",
    primary_phone: "2345678901",
    date_joined: "04/20/2024",
    associations: ["e5"],
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    id: "3456",
    name: "Emma Davis",
    given_name: "Emma",
    family_name: "Davis",
    sex: "Female",
    primary_phone: "3456789012",
    date_joined: "05/10/2024",
    associations: ["b3"],
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    id: "7890",
    name: "Oliver Wilson",
    given_name: "Oliver",
    family_name: "Wilson",
    sex: "Male",
    primary_phone: "4567890123",
    date_joined: "06/30/2024",
    associations: ["f6", "g7"],
    photo: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    id: "4567",
    name: "Sophia Taylor",
    given_name: "Sophia",
    family_name: "Taylor",
    sex: "Female",
    primary_phone: "5678901234",
    date_joined: "07/18/2024",
    associations: ["h8"],
    photo: "https://randomuser.me/api/portraits/women/78.jpg",
  },
  {
    id: "8901",
    name: "William Moore",
    given_name: "William",
    family_name: "Moore",
    sex: "Male",
    primary_phone: "6789012345",
    date_joined: "08/25/2024",
    associations: ["i9"],
    photo: "https://randomuser.me/api/portraits/men/87.jpg",
  },
  {
    id: "5670",
    name: "Mia Anderson",
    given_name: "Mia",
    family_name: "Anderson",
    sex: "Female",
    primary_phone: "7890123456",
    date_joined: "09/14/2024",
    associations: ["j10", "k11"],
    photo: "https://randomuser.me/api/portraits/women/90.jpg",
  },
  {
    id: "6781",
    name: "James Thomas",
    given_name: "James",
    family_name: "Thomas",
    sex: "Male",
    primary_phone: "8901234567",
    date_joined: "10/02/2024",
    associations: ["l12"],
    photo: "https://randomuser.me/api/portraits/men/29.jpg",
  },
];

export const ASSOC_DATA = [
  {
    id: "a1",
    name: "Farmers' Cooperative",
    community_id: "c101",
  },
  {
    id: "b1",
    name: "Green Agriculture Group",
    community_id: "c102",
  },
  {
    id: "c2",
    name: "Sustainable Growth Association",
    community_id: "c103",
  },
  {
    id: "d4",
    name: "Urban Farming Collective",
    community_id: "c104",
  },
  {
    id: "e5",
    name: "AgriTech Innovators",
    community_id: "c105",
  },
  {
    id: "f6",
    name: "Organic Produce Network",
    community_id: "c106",
  },
  {
    id: "g7",
    name: "Rural Development Society",
    community_id: "c107",
  },
  {
    id: "h8",
    name: "Community Gardening Alliance",
    community_id: "c108",
  },
  {
    id: "i9",
    name: "Women in Agriculture",
    community_id: "c109",
  },
  {
    id: "j10",
    name: "Youth Farmers Initiative",
    community_id: "c110",
  },
  {
    id: "k11",
    name: "Smallholder Farmers Union",
    community_id: "c111",
  },
  {
    id: "l12",
    name: "Agro-Entrepreneurs Group",
    community_id: "c112",
  },
];
export const COMMUN_DATA = [
  {
    id: "c101",
    name: "Northern Valley",
  },
  {
    id: "c102",
    name: "Greenfield Plains",
  },
  {
    id: "c103",
    name: "Riverbank District",
  },
  {
    id: "c104",
    name: "Sunny Hills",
  },
  {
    id: "c105",
    name: "Golden Acres",
  },
  {
    id: "c106",
    name: "Mountain View",
  },
  {
    id: "c107",
    name: "Lakeside Meadows",
  },
  {
    id: "c108",
    name: "Coastal Farms",
  },
  {
    id: "c109",
    name: "Harvest Town",
  },
  {
    id: "c110",
    name: "Forest Ridge",
  },
  {
    id: "c111",
    name: "Hilltop Village",
  },
  {
    id: "c112",
    name: "South Parklands",
  },
];

export const PASSBOOK_DATA = [
  {
    id: "pb101",
    association_id: "a1",
    member_id: "1234",
    account_types: ["savings", "dues"],
  },
  {
    id: "pb102",
    association_id: "b1",
    member_id: "5678",
    account_types: ["loans"],
  },
  {
    id: "pb103",
    association_id: "c2",
    member_id: "2345",
    account_types: ["savings", "loans"],
  },
  {
    id: "pb104",
    association_id: "d4",
    member_id: "6789",
    account_types: ["dues"],
  },
  {
    id: "pb105",
    association_id: "e5",
    member_id: "3456",
    account_types: ["savings"],
  },
  {
    id: "pb106",
    association_id: "f6",
    member_id: "7890",
    account_types: ["savings", "loans", "dues"],
  },
  {
    id: "pb107",
    association_id: "g7",
    member_id: "4567",
    account_types: ["dues"],
  },
  {
    id: "pb108",
    association_id: "h8",
    member_id: "8901",
    account_types: ["loans"],
  },
  {
    id: "pb109",
    association_id: "i9",
    member_id: "5670",
    account_types: ["savings", "dues"],
  },
  {
    id: "pb110",
    association_id: "j10",
    member_id: "6781",
    account_types: ["savings"],
  },
];

export const OFFICE_DATA = [
  {
    id: "ofc101",
    name: "Main Headquarters",
  },
  {
    id: "ofc102",
    name: "Regional Office - North",
  },
  {
    id: "ofc103",
    name: "Regional Office - South",
  },
  {
    id: "ofc104",
    name: "Branch Office - East",
  },
  {
    id: "ofc105",
    name: "Branch Office - West",
  },
  {
    id: "ofc106",
    name: "City Office - Downtown",
  },
  {
    id: "ofc107",
    name: "City Office - Uptown",
  },
  {
    id: "ofc108",
    name: "Community Outreach Center",
  },
  {
    id: "ofc109",
    name: "Training and Support Office",
  },
  {
    id: "ofc110",
    name: "Finance and Administration Office",
  },
];

export const COLLECTION_DATA = [
  {
    id: 1,
    date: "2024-10-10",
    association_id: 101,
    total_amount: 500.0,
  },
  {
    id: 2,
    date: "2024-10-09",
    association_id: 102,
    total_amount: 750.0,
  },
  {
    id: 3,
    date: "2024-10-08",
    association_id: 103,
    total_amount: 1200.0,
  },
  {
    id: 4,
    date: "2024-10-07",
    association_id: 104,
    total_amount: 950.0,
  },
  {
    id: 5,
    date: "2024-10-06",
    association_id: 105,
    total_amount: 300.0,
  },
  {
    id: 6,
    date: "2024-10-05",
    association_id: 106,
    total_amount: 1100.0,
  },
  {
    id: 7,
    date: "2024-10-04",
    association_id: 107,
    total_amount: 850.0,
  },
  {
    id: 8,
    date: "2024-10-03",
    association_id: 108,
    total_amount: 670.0,
  },
  {
    id: 9,
    date: "2024-10-02",
    association_id: 109,
    total_amount: 500.0,
  },
  {
    id: 10,
    date: "2024-10-01",
    association_id: 110,
    total_amount: 1000.0,
  },
];
