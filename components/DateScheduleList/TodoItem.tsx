import React from 'react'
import ScheduleItemStyle from '../../styles/components/DateScheduleList/ScheduleItemStyle'
import { Icons, TestIconDataType } from '../../utils/types'

interface Props {
  data: TestIconDataType
  onClick: (data: TestIconDataType) => void
}

export default function TodoItem({ data, onClick }: Props) {
  const trimName = (top: boolean, name?: string) => {
    if (!name) return ''

    const maxLen = top ? 13 : 10

    return name.length > maxLen ? (
      <>
        {name.substr(0, maxLen)}
        <i className={Icons.MORE} />
      </>
    ) : (
      name
    )
  }

  const onClickMore = () => {
    alert('더보기 클릭시 나오는 UI가 없어요!')
  }

  return (
    <ScheduleItemStyle.container style={{ cursor: 'default' as const }}>
      <i
        onClick={() => onClick(data)}
        style={{
          fontSize: '1.5rem',
          margin: '0.5rem',
          cursor: 'pointer' as const,
        }}
        className={data.done ? Icons.CHECKED : Icons.UNCHECKED}
      />
      <div
        style={{
          ...ScheduleItemStyle.infoContainer,
          display: 'flex' as const,
          justifyContent: 'space-between' as const,
          alignItems: 'center' as const,
        }}>
        <div style={{ maxWidth: 'calc(100% - 4.8rem)' }}>
          <div style={ScheduleItemStyle.mainLabel}>
            {trimName(
              true,
              `#${data?.channel?.name || ''} > ${data.cardName || ''}`,
            )}
          </div>
          <div style={ScheduleItemStyle.mainLabelArea}>
            <div style={ScheduleItemStyle.label}>
              {trimName(false, data.name)}
            </div>
          </div>
        </div>
        <i
          onClick={onClickMore}
          style={{
            fontSize: '1rem',
            margin: '0.4rem',
            cursor: 'pointer' as const,
          }}
          className="xi-ellipsis-h"
        />
      </div>
    </ScheduleItemStyle.container>
  )
}
