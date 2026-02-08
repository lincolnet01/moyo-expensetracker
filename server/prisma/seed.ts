import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense categories
  { categoryName: 'Rent', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Utilities', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Supplies', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Marketing', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Salaries', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Travel', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Office Equipment', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Insurance', categoryType: 'EXPENSE', isCustom: false },
  { categoryName: 'Miscellaneous', categoryType: 'EXPENSE', isCustom: false },
  // Income categories
  { categoryName: 'Sales Revenue', categoryType: 'INCOME', isCustom: false },
  { categoryName: 'Investment Income', categoryType: 'INCOME', isCustom: false },
  { categoryName: 'Service Fee', categoryType: 'INCOME', isCustom: false },
  { categoryName: 'Other Income', categoryType: 'INCOME', isCustom: false },
];

async function main() {
  console.log('Seeding default categories...');

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        id: defaultCategories.indexOf(category) + 1,
      },
      update: {},
      create: category,
    });
  }

  console.log(`Seeded ${defaultCategories.length} default categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
