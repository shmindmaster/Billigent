const { PrismaClient } = require('../src/generated/prisma');

async function checkData() {
  const prisma = new PrismaClient();
  
  try {
    // Check CDI_Evidence records
    const evidenceCount = await prisma.cDI_Evidence.count();
    const evidenceWithoutEncounter = await prisma.cDI_Evidence.count({
      where: { 
        OR: [
          { encounterFhirId: null },
          { encounterFhirId: "" }
        ]
      }
    });
    
    console.log('=== CDI_Evidence Status ===');
    console.log('Total CDI_Evidence records:', evidenceCount);
    console.log('Records missing encounterFhirId:', evidenceWithoutEncounter);
    
    if (evidenceCount > 0) {
      const sample = await prisma.cDI_Evidence.findFirst({
        include: { 
          cdiReview: { 
            include: { 
              case: true 
            } 
          } 
        }
      });
      console.log('\n=== Sample record ===');
      console.log('Evidence ID:', sample.evidenceId);
      console.log('Current encounterFhirId:', sample.encounterFhirId);
      console.log('CDI Review ID:', sample.cdiReviewId);
      console.log('Case encounterFhirId:', sample.cdiReview?.case?.encounterFhirId);
      console.log('Evidence Type:', sample.evidenceType);
    }
    
    // Check if any cases exist
    const casesCount = await prisma.cases.count();
    console.log('\n=== Cases Status ===');
    console.log('Total Cases:', casesCount);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();