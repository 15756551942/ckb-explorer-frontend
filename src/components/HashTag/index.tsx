import React from 'react'
import styled from 'styled-components'

const TagPanel = styled.div`
  height: 20px;
  width: ${({ length }: { length: number; isLock?: boolean }) => `${length * (length > 10 ? 8.5 : 10)}px`};
  border-radius: 4px;
  border: solid 0.5px ${({ isLock }: { isLock?: boolean }) => (isLock ? '#b1caff' : '#caacef')};
  background-color: ${({ isLock }: { isLock?: boolean }) => (isLock ? '#d8e4ff' : '#f0e0fb')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  @media (max-width: 750px) {
    height: 16px;
    width: ${({ length }: { length: number; isLock?: boolean }) => `${length * (length > 10 ? 7.5 : 9)}px`};
  }
`

export default ({ content, category = 'lock' }: { content: string; category?: 'lock' | 'type' }) => {
  return (
    <TagPanel isLock={category === 'lock'} length={content.length}>
      <span>{content}</span>
    </TagPanel>
  )
}
