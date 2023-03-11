import styled from 'styled-components'
import Octicon from './Octicon'

export const Icon = styled(Octicon)`
  vertical-align: middle;
  padding-right: 8px;
  &:not(.main, .active) {
    opacity: 0.5;
  }
  .active > & {
    opacity: 1;
  }
`

export const SideNavGroup = styled.span`
  position: relative;
  & > ul {
    padding-left: 8px;
    margin-bottom: 14px;

    ul {
      padding-left: 24px;
    }
  }

  li {
    list-style: none;
    text-transform: capitalize;
  }
  a {
    color: inherit;
  }
  &.active {
    ::before {
      position: absolute;
      top: 0;
      left: -1.5rem;
      bottom: 0;
      display: block;
      content: '';
      width: 0.25rem;
      background-color: #28a745;
      opacity: 0.4;
    }
  }
  > a {
    &.active {
      position: relative;
      color: #28a745;
      span {
        opacity: 1;
      }
    }
  }
`
export const Sidebar = styled.div`
  @media (min-width: 1024px) {
    position: sticky;
    top: 0px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
`

export const MainNav = styled.div`
  @media (min-width: 1024px) {
    overflow-y: scroll;
    padding-right: 24px;
    padding-bottom: 24px;
    //  height: 100%;
  }
`
