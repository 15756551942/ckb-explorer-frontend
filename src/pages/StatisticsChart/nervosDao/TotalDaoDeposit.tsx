import React, { useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { getStatisticTotalDaoDeposit } from '../../../service/app/charts/nervosDao'
import { useAppState, useDispatch } from '../../../contexts/providers'
import i18n, { currentLanguage } from '../../../utils/i18n'
import { handleAxis } from '../../../utils/chart'
import { ChartNotePanel } from '../common/styled'
import { parseDateNoTime } from '../../../utils/date'
import { isMobile } from '../../../utils/screen'
import { shannonToCkb } from '../../../utils/util'
import { ChartColors } from '../../../utils/const'
import { isMainnet } from '../../../utils/chain'
import { ChartLoading, ReactChartCore, ChartPage, tooltipColor, tooltipWidth } from '../common'
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
  left: '4%',
  right: '4%',
  bottom: '5%',
  containLabel: true,
}

const getOption = (
  statisticTotalDaoDeposits: State.StatisticTotalDaoDeposit[],
  isThumbnail = false,
): echarts.EChartOption => {
  return {
    color: ChartColors,
    tooltip: !isThumbnail
      ? {
          trigger: 'axis',
          formatter: (dataList: any) => {
            const widthSpan = (value: string) => tooltipWidth(value, currentLanguage() === 'en' ? 110 : 110)
            let result = `<div>${tooltipColor('#333333')}${widthSpan(i18n.t('statistic.date'))} ${parseDateNoTime(
              dataList[0].name,
            )}</div>`
            if (dataList[0].data) {
              result += `<div>${tooltipColor(ChartColors[0])}${widthSpan(
                i18n.t('statistic.total_dao_deposit'),
              )} ${handleAxis(dataList[0].data, 2)}</div>`
            }
            if (dataList[1].data) {
              result += `<div>${tooltipColor(ChartColors[1])}${widthSpan(
                i18n.t('statistic.total_dao_depositor'),
              )} ${handleAxis(dataList[1].data, 2, true)}</div>`
            }
            return result
          },
        }
      : undefined,
    grid: isThumbnail ? gridThumbnail : grid,
    xAxis: [
      {
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.date'),
        nameLocation: 'middle',
        nameGap: 30,
        type: 'category',
        boundaryGap: false,
        data: statisticTotalDaoDeposits.map(data => data.createdAtUnixtimestamp),
        axisLabel: {
          formatter: (value: string) => parseDateNoTime(value),
        },
      },
    ],
    yAxis: [
      {
        position: 'left',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.total_dao_deposit'),
        nameTextStyle: {
          align: 'left',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[0],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${handleAxis(value)}B`,
        },
      },
      {
        position: 'right',
        name: isMobile() || isThumbnail ? '' : i18n.t('statistic.total_dao_depositor'),
        nameTextStyle: {
          align: 'right',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: ChartColors[1],
          },
        },
        axisLabel: {
          formatter: (value: string) => `${handleAxis(new BigNumber(value))}`,
        },
      },
    ],
    series: [
      {
        name: i18n.t('statistic.total_dao_deposit'),
        type: 'line',
        yAxisIndex: 0,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticTotalDaoDeposits.map(data => new BigNumber(shannonToCkb(data.totalDaoDeposit)).toFixed(0)),
      },
      {
        name: i18n.t('statistic.total_dao_depositor'),
        type: 'line',
        yAxisIndex: 1,
        symbol: isThumbnail ? 'none' : 'circle',
        symbolSize: 3,
        data: statisticTotalDaoDeposits.map(data => new BigNumber(data.totalDepositorsCount).toNumber()),
      },
    ],
  }
}

export const TotalDaoDepositChart = ({
  statisticTotalDaoDeposits,
  isThumbnail = false,
}: {
  statisticTotalDaoDeposits: State.StatisticTotalDaoDeposit[]
  isThumbnail?: boolean
}) => {
  if (!statisticTotalDaoDeposits || statisticTotalDaoDeposits.length === 0) {
    return <ChartLoading show={statisticTotalDaoDeposits === undefined} isThumbnail={isThumbnail} />
  }
  return <ReactChartCore option={getOption(statisticTotalDaoDeposits, isThumbnail)} isThumbnail={isThumbnail} />
}

export const initStatisticTotalDaoDeposit = (dispatch: AppDispatch) => {
  dispatch({
    type: PageActions.UpdateStatisticTotalDaoDeposit,
    payload: {
      statisticTotalDaoDeposits: undefined,
    },
  })
}

export default () => {
  const dispatch = useDispatch()
  const { statisticTotalDaoDeposits } = useAppState()

  useEffect(() => {
    initStatisticTotalDaoDeposit(dispatch)
    getStatisticTotalDaoDeposit(dispatch)
  }, [dispatch])

  return (
    <ChartPage
      title={i18n.t('statistic.total_dao_deposit_depositor')}
      description={i18n.t('statistic.total_dao_deposit_description')}
    >
      <TotalDaoDepositChart statisticTotalDaoDeposits={statisticTotalDaoDeposits} />
      {isMainnet() && <ChartNotePanel>{`${i18n.t('common.note')}1GB = 1,000,000,000 CKBytes`}</ChartNotePanel>}
    </ChartPage>
  )
}
