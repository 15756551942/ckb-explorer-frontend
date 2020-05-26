import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticHashRate } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
import { handleHashRate } from '../../../utils/number'
import { ChartColors } from '../../../utils/const'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common/ChartComp'
import { AppDispatch } from '../../../contexts/reducer'
import { PageActions } from '../../../contexts/actions'

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

const getOption = (statisticHashRates: State.StatisticHashRate[], isThumbnail = false) => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
        let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
          dataList[0].name,
        )}</div>`
        result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('block.hash_rate'))} ${handleHashRate(
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
        data: statisticHashRates.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('block.hash_rate'),
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
        name: i18n.t('block.hash_rate'),
        type: 'line',
        yAxisIndex: '0',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticHashRates.map(data => new BigNumber(data.avgHashRate).toNumber()),
      },
    ],
  }
}

export const HashRateChart = ({
  statisticHashRates,
  isThumbnail = false,
}: {
  statisticHashRates: State.StatisticHashRate[]
  isThumbnail?: boolean
}) => {
  if (!statisticHashRates || statisticHashRates.length === 0) {
    return <ChartLoading show={statisticHashRates === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticHashRates, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticHashRate = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticHashRate,
    payload: {
      statisticHashRates: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticHashRates } = useAppState()

  useEffect(() => {
    initStatisticHashRate(dispatch)
    getStatisticHashRate(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('block.hash_rate')}>
      <HashRateChart statisticHashRates={statisticHashRates} />
    </ChartPage>
  )
}
