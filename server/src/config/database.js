const { PrismaClient } = require('@prisma/client');

// single instance across the whole server — avoid opening too many connections
const prisma = new PrismaClient();

module.exports = prisma;
