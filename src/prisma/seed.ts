import { prisma } from "./client";
import bcrypt from "bcryptjs";

const roles = ["admin", "rescuer", "adopter"];

const breeds = [
  "Akita",
  "Akita americano",
  "American bully",
  "Basset hound",
  "Beagle",
  "Bichón maltés",
  "Bolldog",
  "Bulldog inglés",
  "Bulldog francés",
  "Bull terrier",
  "Boxer",
  "Boyero de Berna",
  "Cane corso",
  "Chihuahua",
  "Chow chow",
  "Cocker spaniel",
  "Dachshund (salchicha)",
  "Dogo argentino",
  "Doberman",
  "Fila brasilero",
  "Fox terrier",
  "Galgo",
  "Gran Danés",
  "Havanese",
  "Husky siberiano",
  "Jack russell terrier",
  "Mastín",
  "Presa canario",
  "Pitbull",
  "Poodle",
  "Pug",
  "Rottweiler",
  "Samoyedo",
  "Schnauzer",
  "Shiba inu",
  "Shih tzu",
  "Shar pei",
  "Terrier escocés",
  "Vizsla",
  "Yorkshire terrier",
];

const vaccines = [
  "Parvovirus",
  "Distemper",
  "Hepatitis",
  "Leptospirosis",
  "Rabia",
  "Refuezo anual",
];

async function seed() {
  console.log("Starting seed process...");
  for (const role of roles) {
    await prisma.roles.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }
  console.log("Roles seeded");
  for (const breed of breeds) {
    await prisma.breeds.upsert({
      where: { name: breed },
      update: {},
      create: { name: breed },
    });
  }
  console.log("Breeds seeded");
  for (const vaccine of vaccines) {
    await prisma.vaccines.upsert({
      where: { name: vaccine },
      update: {},
      create: { name: vaccine },
    });
  }
  console.log("Vaccines seeded");
  const admiPassword = await bcrypt.hash("pwd123", 10);
  await prisma.users.upsert({
    where: { email: "gugadev@outlook.com" },
    update: {},
    create: {
      name: "Gustavo Garcia",
      email: "gugadev@outlook.com",
      password: admiPassword,
      photo_url: "https://avatars.githubusercontent.com/u/71278914?v=4",
      role_id: 2,
    },
  });
  console.log("Admin user seeded");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
