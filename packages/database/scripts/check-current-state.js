const { PrismaClient } = require('../src/generated/prisma');

async function checkCurrentState() {
  const prisma = new PrismaClient();
  
  try {
    // Check existing tables and record counts
    console.log('=== Current Database State ===');
    
    const evidenceCount = await prisma.cDI_Evidence.count();
    console.log('Total CDI_Evidence records:', evidenceCount);
    
    const casesCount = await prisma.cases.count();
    console.log('Total Cases:', casesCount);
    
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
      console.log('\n=== Sample CDI_Evidence record ===');
      console.log('Evidence ID:', sample.evidenceId);
      console.log('Evidence Type:', sample.evidenceType);
      console.log('CDI Review ID:', sample.cdiReviewId);
      console.log('Case encounterFhirId (will be used to populate new field):', sample.cdiReview?.case?.encounterFhirId);
      console.log('Has embedding field:', 'embedding' in sample ? 'Yes' : 'No');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentState();