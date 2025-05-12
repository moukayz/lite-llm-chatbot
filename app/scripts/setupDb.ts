import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execPromise = promisify(exec);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Check if .env file exists and has DATABASE_URL
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.log('Creating .env file with DATABASE_URL...');
      fs.writeFileSync(
        envPath, 
        'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lite_llm_chatbot"\n' +
        'NEXT_PUBLIC_DB_STORAGE="postgres"\n'
      );
    } else {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (!envContent.includes('DATABASE_URL')) {
        fs.appendFileSync(
          envPath, 
          '\nDATABASE_URL="postgresql://postgres:postgres@localhost:5432/lite_llm_chatbot"\n'
        );
      }
      if (!envContent.includes('NEXT_PUBLIC_DB_STORAGE')) {
        fs.appendFileSync(
          envPath,
          '\nNEXT_PUBLIC_DB_STORAGE="postgres"\n'
        );
      }
    }
    
    // Run migrations
    console.log('Generating Prisma client...');
    await execPromise('npx prisma generate');
    
    console.log('Running database migrations...');
    await execPromise('npx prisma migrate dev --name init');
    
    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase(); 