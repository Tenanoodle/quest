import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.inboxItem.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.quest.deleteMany();

  const quests = await Promise.all([
    prisma.quest.create({
      data: {
        title: 'Launch Navigation Systems',
        description: 'Calibrate the nav array and ensure jump coordinates are stable.',
        priority: 1,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
        milestones: {
          create: [
            {
              title: 'Chart hyperspace lanes',
              tasks: {
                create: [
                  { title: 'Survey known routes', done: true },
                  { title: 'Simulate emergent anomalies', done: false }
                ]
              }
            },
            {
              title: 'Sync nav-core',
              tasks: {
                create: [
                  { title: 'Update firmware', done: true },
                  { title: 'Run diagnostics', done: false }
                ]
              }
            }
          ]
        },
        tasks: {
          create: [
            { title: 'Verify jump beacon', done: true },
            { title: 'Align starmap overlays', done: false },
            { title: 'Brief the flight crew', done: false }
          ]
        }
      }
    }),
    prisma.quest.create({
      data: {
        title: 'Assemble Away Team',
        description: 'Recruit specialists and prepare mission dossiers.',
        priority: 2,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
        milestones: {
          create: [
            {
              title: 'Crew Selection',
              tasks: {
                create: [
                  { title: 'Interview candidates', done: true },
                  { title: 'Finalize roster', done: false }
                ]
              }
            },
            {
              title: 'Briefing Packet',
              tasks: {
                create: [
                  { title: 'Compile mission intel', done: true },
                  { title: 'Design mission badges', done: true }
                ]
              }
            }
          ]
        },
        tasks: {
          create: [
            { title: 'Schedule training simulations', done: false },
            { title: 'Assign team leads', done: true }
          ]
        }
      }
    }),
    prisma.quest.create({
      data: {
        title: 'Secure Supply Lines',
        description: 'Ensure cargo routes are safe and stocked for the expedition.',
        priority: 3,
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
        milestones: {
          create: [
            {
              title: 'Resource Audit',
              tasks: {
                create: [
                  { title: 'Inventory depot', done: true },
                  { title: 'Check fuel reserves', done: false }
                ]
              }
            },
            {
              title: 'Escort Planning',
              tasks: {
                create: [
                  { title: 'Assign escort ships', done: true },
                  { title: 'Draft contingency routes', done: false }
                ]
              }
            }
          ]
        },
        tasks: {
          create: [
            { title: 'Negotiate docking rights', done: false },
            { title: 'Confirm supply drop schedule', done: true },
            { title: 'Update logistics dashboard', done: true }
          ]
        }
      }
    })
  ]);

  await prisma.inboxItem.createMany({
    data: [
      { text: 'Remember to ping Dr. Vega about stellar cartography.' },
      { text: 'Prototype new task toggles animation.' },
      { text: 'Draft comms for mission launch livestream.' }
    ]
  });

  console.log(`Seeded ${quests.length} quests.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
