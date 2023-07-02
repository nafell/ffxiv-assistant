# Environment Setup

### Project Launch
Windows:  
`npx create-next-app -e with-supabase ffxiv-assistant --typescript; cd ./ffxiv-assistant/`  

Linux:  
`npx create-next-app -e with-supabase ffxiv-assistant --typescript && cd ./ffxiv-assistant/`  

### Configuration
Rename `.env.local.example` -> `.env.local`  
1. Supabase -> Project -> Settings -> API
2. Copy "Project URL", "Project API keys"
3. Paste them into .env.local

package.json
```json
  "scripts": {
    "dev": "next dev -p 14141", /*modify this line*/
    "build": "next build",
   ...
```

### npm i
`npm i @supabase/supabase-js`  
`npm i prisma`  
`npm i @prisma/client`  


### Setup Prisma
`npx prisma init --datasource-provider postgresql`  
.env:  
```
DIRECT_URL=paste url from Supabase -> (open project) -> settings -> Database -> Connection string  
DATABASE_URL=(Connection Pooling / Connection String)?pgbouncer=true
```
fill in [YOUR-PASSWORD]  

schema.prisma:
Add to `datasource db {}` block  
  directUrl = env("DIRECT_URL")
define models  

guided by: https://supabase.com/docs/guides/integrations/prisma

`npx prisma migrate dev --name init`  


### Google Sheets API
`npm i googleapis`
.env:  
```
SHEETS_ID=get id from sheet URL
GOOGLE_APPLICATION_CREDENTIALS=./secrets.json
```
.gitignore:  
```
#Google Sheets API
secrets.json
```

Google Cloud Platform -> APIs and services -> Credentials -> Service Accounts -> Keys -> Add Key -> JSON -> save to project root
