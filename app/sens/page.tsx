import LoginButton from '@/components/LoginButton'
import LogoutButton from '@/components/LogoutButton'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'


export default async function sensitive() {
    const supabase = createServerComponentClient({ cookies })

    const { data: { user }, } = await supabase.auth.getUser()

    


    return (<div className="w-full flex flex-col items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
            <div />
            <div>
                {user ? (
                <LogoutButton />
                ) : (
                <LoginButton redirectPath='/sens' />
                )}
            </div>
            </div>
        </nav>
        <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
            <div className="flex flex-col items-center mb-4 lg:mb-12">
            
                {user ? (<>
                    <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
                        You are logged in.
                    </p>
                </>) : (<>
                    <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
                        You are not logged in.
                        <LoginButton redirectPath='/sens' />
                    </p>
                </>)}
                
            </div>
        </div>
    </div>)
}