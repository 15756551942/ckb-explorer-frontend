import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticAddressCount } from '../../../service/app/charts/activities'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'
import { ChartColors } from '../../../utils/const'

const gridThumbnail = {
  left: '4%',
  right: '10%',
  top: '8%',
  bottom: '6%',
  containLabel: true,
}
const grid = {
  left: '3%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (statisticAddressCounts: State.StatisticAddressCount[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 100 : 65)
        let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.address_count'))} ${handleAxis(
          dataList[0].data,
        )}</div>`
        return result
      },
    },
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: '30',
        type: 'category',
        boundaryGap: false,
        data: statisticAddressCounts.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.address_count'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => handleAxis(new BigNumber(value)),
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.address_count'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAddressCounts.map(data => new BigNumber(data.addressesCount).toNumber()),
      },
    ],
  }
}

export const initStatisticAddressCount = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticAddressCount,
    payload: {
      statisticAddressCounts: undefined,
    },
  })
}

export const AddressCountChart = ({
  statisticAddressCounts,
  isThumbnail = false,
}: {
  statisticAddressCounts?: State.StatisticAddressCount[]
  isThumbnail?: boolean
}) => {
  if (!statisticAddressCounts || statisticAddressCounts.length === 0) {
    return <ChartLoading show={statisticAddressCounts === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticAddressCounts, isThumbnail)} isThumbnail={isThumbnail} />
}

export default () => {
  const dispatch = useDispatch()
  const { statisticAddressCounts } = useAppState()

  useEffect(() => {
    initStatisticAddressCount(dispatch)
    getStatisticAddressCount(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('statistic.address_count')}>
      <AddressCountChart statisticAddressCounts={statisticAddressCounts} />
    </ChartPage>
  )
}
