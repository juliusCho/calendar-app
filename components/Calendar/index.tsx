import moment from 'moment'
import React from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import Box from '../../foundations/Box'
import Button from '../../foundations/Button'
import Icon from '../../foundations/Icon'
import Text from '../../foundations/Text'
import CalendarContainerStyle from '../../styles/components/Calendar/CalendarContainerStyle'
import theme from '../../styles/theme'
import * as helper from '../../utils/helpers'
import { useIsMounted } from '../../utils/hooks'
import { Days, Months } from '../../utils/i18n'
import { Icons } from '../../utils/types'
import DateTimePicker from '../DateTimePicker'
import CalendarDateContainer from './CalendarDateContainer'

// 캘린더 상단 요일 표시
const createDayLabels = (startDay: number, t: TFunction<string>) => {
  const DayList: React.ReactNode[] = []

  let dayCount = 0
  for (let dayNum: number = startDay; dayNum < 7; dayNum++) {
    DayList.push(
      <Box
        key={Days[dayNum]}
        direction="horizontal"
        style={CalendarContainerStyle.dayHeader}>
        <Text
          value={t(`calendar.${Days[dayNum]}`)}
          style={
            {
              ...CalendarContainerStyle.day,
              color:
                dayNum === 0 || dayNum === 6
                  ? theme.palette.main.red
                  : theme.palette.mono.darkGray,
            } as React.CSSProperties
          }
        />
      </Box>,
    )

    dayCount++
    if (dayCount === 7) {
      break
    } else if (dayNum === 6 && dayCount < 7) {
      dayNum = -1
    }
  }

  return DayList
}

interface Props {
  isMobile: boolean
  baseDate: Date
  onChangeMonth: (date: Date) => void
  chosenDate?: Date
  onClick: (date: Date, doubleClicked?: boolean) => void
  onDoubleClickSchedule: (scheduleNo: number) => void
  startDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export default function Calendar({
  isMobile, // 사용 디바이스의 모바일 여부
  baseDate, // 포커스 월
  onChangeMonth, // 월 변경 callback
  chosenDate, // 선택 일자
  onClick, // 일자 클릭 callback
  onDoubleClickSchedule, // 일자 내 일정 더블클릭 callback
  startDay = 0, // 시작 요일 index
}: Props) {
  const { t } = useTranslation()

  // 포커스 년
  const [year, setYear] = React.useState(
    Number(moment(new Date()).format('YYYY')),
  )
  // 포커스 월
  const [month, setMonth] = React.useState(
    Number(moment(new Date()).format('MM')),
  )
  // 포커스 년일
  const [yearMonth, setYearMonth] = React.useState(
    moment(new Date()).format('YYYYMM'),
  )
  // 월 선택 모달 표시 여부
  const [showYearMonthModal, setShowYearMonthModal] = React.useState(false)
  // 사용자 스크롤 감지 여부
  const [actionProcessing, setActionProcessing] = React.useState(false)

  const isMounted = useIsMounted()

  // 포커스 월에 따른 년월 세팅
  React.useEffect(() => {
    if (isMounted()) {
      if (baseDate) {
        setYear(() => Number(moment(baseDate).format('YYYY')))
        setMonth(() => Number(moment(baseDate).format('MM')))
      }
    }
  }, [isMounted, baseDate])

  // 포커스 월에 따른 년월 세팅
  React.useEffect(() => {
    if (isMounted()) {
      if (yearMonth.substr(4, 2) === helper.makeTwoDigits(month)) return

      setYearMonth(() => String(year) + helper.makeTwoDigits(month))
    }
  }, [isMounted, year, month, helper.makeTwoDigits, yearMonth])

  const DayList = React.useMemo(() => createDayLabels(startDay, t), [
    startDay,
    t,
  ])

  // 월 변경 이벤트
  const onChange = (increment: boolean) => {
    setActionProcessing(true)

    let changingYear = year
    let changingMonth = month

    if (month === 1) {
      if (increment) {
        changingMonth++
      } else {
        changingYear--
        changingMonth = 12
      }
    } else if (month === 12) {
      if (increment) {
        changingYear++
        changingMonth = 1
      } else {
        changingMonth--
      }
    } else {
      if (increment) {
        changingMonth++
      } else {
        changingMonth--
      }
    }
    onChangeMonth(new Date(changingYear, changingMonth - 1, 1))
  }

  // 월 선택 모달에서 선택 후 이벤트
  const onSelect = (date?: Date | Array<Date | undefined>) => {
    if (date && !Array.isArray(date)) {
      onChangeMonth(date)
      setShowYearMonthModal(false)
    }
  }

  // 일자 드래그 선택 이벤트
  const onRangeSelect = (range: Date[]) => {
    const min = moment(
      range.reduce((prev, next) => {
        const prevNum = Number(moment(prev).format('YYYYMMDD'))
        const nextNum = Number(moment(next).format('YYYYMMDD'))
        return prevNum < nextNum ? prev : next
      }),
    ).format('YYYY년 MM월 DD일')
    const max = moment(
      range.reduce((prev, next) => {
        const prevNum = Number(moment(prev).format('YYYYMMDD'))
        const nextNum = Number(moment(next).format('YYYYMMDD'))
        return prevNum > nextNum ? prev : next
      }),
    ).format('YYYY년 MM월 DD일')
    alert(`${min}~${max} 기간 동안의 일정 생성 화면이 없어요!`)
  }

  return (
    <CalendarContainerStyle.container>
      <div style={CalendarContainerStyle.header}>
        <Box direction="horizontal" style={CalendarContainerStyle.headerTop}>
          <div style={CalendarContainerStyle.pickerModal}>
            <DateTimePicker
              date={new Date(year, month - 1, 1)}
              changeDate={onSelect}
              isOpen={showYearMonthModal}
              datePick={false}
            />
          </div>
          <Box
            direction="horizontal"
            style={CalendarContainerStyle.headerTopSub}>
            <Icon
              icon={Icons.ANGLE_LEFT}
              onClick={() => onChange(false)}
              style={CalendarContainerStyle.topItem}
            />
            <Button
              value={t('calendar.yearMonth', {
                year,
                month: t(`calendar.${Months[month - 1]}`),
              })}
              style={CalendarContainerStyle.topItem}
              onClick={() => setShowYearMonthModal(true)}
            />
            <Icon
              icon={Icons.ANGLE_RIGHT}
              onClick={() => onChange(true)}
              style={CalendarContainerStyle.topItem}
            />
          </Box>
        </Box>
        <Box direction="horizontal" style={CalendarContainerStyle.dayContainer}>
          {DayList}
        </Box>
      </div>
      <div style={CalendarContainerStyle.dateContainer}>
        <CalendarDateContainer
          startDay={startDay}
          isMobile={isMobile}
          onChangeMonth={onChangeMonth}
          chosenDate={chosenDate}
          yearMonth={yearMonth}
          onClick={onClick}
          onDoubleClickSchedule={onDoubleClickSchedule}
          onRangeSelect={onRangeSelect}
          actionProcessing={actionProcessing}
          setActionProcessing={setActionProcessing}
        />
      </div>
    </CalendarContainerStyle.container>
  )
}
