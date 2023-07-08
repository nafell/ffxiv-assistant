"use client"

import { WeekScheduleInflated } from '@/app/api/schedule/[id]/weekschedule/[firstDay]/route'
import { Appointment } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect, useState } from 'react'

const ScheduleTable = ({ authorized } : { authorized: boolean }) => {
    const { data: session } = useSession()
    const [ loaded, setLoaded ] = useState(false)
    let firstLoad = true

    const initialSchedules: WeekScheduleInflated[] = []
    const [ schedules, setSchedules ] = useState(initialSchedules)
    const [ selectedSchedule, setSelectedSchedule ] = useState<WeekScheduleInflated | undefined>()
    const [ selectedAppointments, setSelectedAppointments ] = useState<Appointment[] | undefined>()
    const [ scheduleCount, setScheduleCount ] = useState(0)

    const handleSelectionChange = (e: ChangeEvent<HTMLInputElement>) => {
        try{

            const sch = schedules[Number(e.target.value)]
            setSelectedSchedule(sch)
            setSelectedAppointments(sch.appointments)
        }
        catch {
            setSelectedSchedule(undefined)
            setSelectedAppointments(undefined)
        }
    }

    const renderDropdown = () => {
        const list:JSX.Element[] = []
        let counter = 0;
        for (let schedule of schedules) { //typeof schedule.firstDay is string (WHY?)
            list.push((<option key={counter} value={counter}>{(new Date(schedule.firstDay)).toDateString()}</option>))
            counter++
        }
        return list
    }

    useEffect(() => {
        console.log("authorized:"+authorized)
        if (authorized && firstLoad) {
            fetchWeekSchedules()  

            firstLoad = false
        }
    }, [authorized])

    const fetchWeekSchedules = async () => {
        console.log("fetch:"+session?.user?.discordToken!)

        let cursorDate = new Date()
        if (cursorDate.getDay() > 1) {//tue-sat
            cursorDate.setDate(cursorDate.getDate() - 7)
        }

        const response = await fetch(`${location.origin}/api/schedule/1/weekschedule?relevant`,{
            method: 'get',
            headers: new Headers({
                "discordToken": session?.user?.discordToken!
            }) 
        })

        const schedules: WeekScheduleInflated[] = await response.json()

        setSchedules(schedules)
        setScheduleCount(schedules.length)
        setLoaded(true)
    }

    return (<div className='ScheduleTable'>
        <button onClick={(() => setLoaded(true))} className='h-8 py-2.5 px-5 rounded-full no-underline text-foreground bg-pink-600 hover:bg-pink-700 flex items-center group text-sm'>fetchFruits</button>
        <select onChange={handleSelectionChange}>
            <option key={-1} value={-1}> -- Select a weekSchedule -- </option>
            {loaded ?
                (
                    renderDropdown()
                ) : ( <option key={-2} value={-2}>loading...</option> )
            }
        </select>
        {loaded ? 
            (
                <></>
            ) : (
                <svg className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            )
        }
   </div>)
}
export default ScheduleTable