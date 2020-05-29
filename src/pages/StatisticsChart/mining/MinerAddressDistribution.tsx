import React, { useEffect } from 'react'
import { getStatisticMinerAddressDistribution } from '../../../service/app/charts/mining'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { isMobile } from '../../../utils/screen'
import { useAppState, useDispatch } from '../../../contexts/providers'
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

const getOption = (
  statisticMinerAddresses: State.StatisticMinerAddress[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 75 : 50)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.address'))} ${
              dataList[0].name
            }</div>`
            result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(i18n.t('statistic.miner_radio'))} ${
              dataList[0].data
            }%</div>`
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.address'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticMinerAddresses.map(data => data.address),
        axisLabel: {
          formatter: (value: string) => value,
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.miner_radio'),
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${value}%`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.miner_radio'),
        type: 'pie',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticMinerAddresses.map(data => Number(data.radio) * 100),
      },
    ],
  }
}

export const MinerAddressDistributionChart = ({
  statisticMinerAddresses,
  isThumbnail = false,
}: {
  statisticMinerAddresses: State.StatisticMinerAddress[]
  isThumbnail?: boolean
}) => {
  if (!statisticMinerAddresses || statisticMinerAddresses.length === 0) {
    return <ChartLoading show={statisticMinerAddresses === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticMinerAddresses, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticMinerAddressDistribution = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticMinerAddressDistribution,
    payload: {
      statisticMinerAddresses: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticMinerAddresses } = useAppState()

  useEffect(() => {
    initStatisticMinerAddressDistribution(dispatch)
    getStatisticMinerAddressDistribution(dispatch)
  }, [dispatch])

  return (
    <ChartPage title={i18n.t('block.hash_rate')}>
      <MinerAddressDistributionChart statisticMinerAddresses={statisticMinerAddresses} />
    </ChartPage>
  )
}
