import React, { useEffect, useCallback } from 'react'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'default-passive-events'
import Content from '../../components/Content'
import { getStatisticAddressBalanceRank } from '../../service/app/statisticsChart'
import { PageActions } from '../../contexts/providers/reducer'
import { useAppState, useDispatch } from '../../contexts/providers'
import i18n from '../../utils/i18n'
import { handleAxis } from '../../utils/chart'
import { ChartTitle, ChartPanel } from './styled'
import { isMobile } from '../../utils/screen'
import { shannonToCkb } from '../../utils/util'
import { localeNumberString } from '../../utils/number'
import { adaptPCEllipsis } from '../../utils/string'
import browserHistory from '../../routes/history'
import { ChartLoading, ReactChartCore } from './ChartComponents'

const colors = ['#3182bd']

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

const getAddressWithRanking = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], ranking: string) => {
  const addressBalanceRank = statisticAddressBalanceRanks.find(rank => rank.ranking === ranking)
  return addressBalanceRank ? addressBalanceRank.address : ''
}

const getOption = (statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[], isThumbnail = false) => {
  return {
    color: colors,
    tooltip: !isThumbnail && {
      trigger: 'axis',
      formatter: (dataList: any[]) => {
        const colorSpan = (color: string) =>
          `<span style="display:inline-block;margin-right:8px;margin-left:5px;margin-bottom:2px;border-radius:10px;width:6px;height:6px;background-color:${color}"></span>`
        const widthSpan = (value: string) => `<span style="width:60px;display:inline-block;">${value}:</span>`
        let result = `<div>${colorSpan('#333333')}${widthSpan(i18n.t('statistic.address'))} ${adaptPCEllipsis(
          getAddressWithRanking(statisticAddressBalanceRanks, dataList[0].name),
          6,
          60,
        )}</div>`
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('statistic.balance'))} ${localeNumberString(
          dataList[0].data,
        )} ${i18n.t('common.ckb_unit')}</div>`
        result += `<div>${colorSpan(colors[0])}${widthSpan(i18n.t('statistic.ranking'))} ${dataList[0].name}</div>`
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
        data: statisticAddressBalanceRanks.map(data => data.ranking),
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : `${i18n.t('statistic.balance_ranking')} ${i18n.t('statistic.log')}`,
        type: 'log',
        logBase: 10,
        scale: true,
        axisLine: {
          lineStyle: {
            color: colors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => {
            return `${handleAxis(value)}B`
          },
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.balance_ranking'),
        type: 'bar',
        yAxisIndex: '0',
        barWidth: '8',
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticAddressBalanceRanks.map(data => shannonToCkb(data.balance)),
      },
    ],
  }
}

export const AddressBalanceRankChart = ({
  statisticAddressBalanceRanks,
  clickEvent,
  isThumbnail = false,
}: {
  statisticAddressBalanceRanks: State.StatisticAddressBalanceRank[]
  clickEvent: any
  isThumbnail?: boolean
}) => {
  if (!statisticAddressBalanceRanks || statisticAddressBalanceRanks.length === 0) {
    return <ChartLoading show={statisticAddressBalanceRanks === undefined} isThumbnail={isThumbnail} />
  }
  return (
    <ReactChartCore
      option={getOption(statisticAddressBalanceRanks)}
      isThumbnail={isThumbnail}
      clickEvent={clickEvent}
    />
  )
}

export default () => {
  const dispatch = useDispatch()
  const { statisticAddressBalanceRanks } = useAppState()

  const clickEvent = useCallback(
    (param: any) => {
      if (param && param.name) {
        browserHistory.push(`/address/${getAddressWithRanking(statisticAddressBalanceRanks, param.name)}`)
      }
    },
    [statisticAddressBalanceRanks],
  )

  useEffect(() => {
    dispatch({
      type: PageActions.UpdateStatisticAddressBalanceRank,
      payload: {
        statisticAddressBalanceRanks: undefined,
      },
    })
    getStatisticAddressBalanceRank(dispatch)
  }, [dispatch])

  return (
    <Content>
      <ChartTitle>{i18n.t('statistic.balance_ranking')}</ChartTitle>
      <ChartPanel>
        <AddressBalanceRankChart statisticAddressBalanceRanks={statisticAddressBalanceRanks} clickEvent={clickEvent} />
      </ChartPanel>
    </Content>
  )
}
