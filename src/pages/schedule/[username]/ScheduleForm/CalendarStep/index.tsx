import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Container,
  TimerPicker,
  TimerPickerHeader,
  TimerPickerItem,
  TimerPickerList,
} from './style'

interface Availability {
  possibiliteTime: number[]
  availableTimes: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const router = useRouter()

  const isDateSelected = !!selectedDate
  const username = router.query.username

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const selectedDateWithoutTime = selectedDate
    ? dayjs(selectedDate).format(`YYYY-MM-DD`)
    : null

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateWithoutTime],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateWithoutTime,
        },
      })

      return response.data
    },
    {
      enabled: !!selectedDate,
    },
  )

  function handleSelectedTime(hour: number) {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate()

    onSelectDateTime(dateWithTime)
  }

  return (
    <Container isTimerPickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimerPicker>
          <TimerPickerHeader>
            {weekDay} <span>{describedDate}</span>
          </TimerPickerHeader>

          <TimerPickerList>
            {availability?.possibiliteTime.map((hour) => {
              return (
                <TimerPickerItem
                  key={hour}
                  disabled={!availability.availableTimes.includes(hour)}
                  onClick={() => handleSelectedTime(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimerPickerItem>
              )
            })}
          </TimerPickerList>
        </TimerPicker>
      )}
    </Container>
  )
}
