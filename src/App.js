import React, { Component } from 'react'
import styled from 'styled-components'

import Navbar from './Navbar'
import ModelInput from './ModelInput'
import ModelOutput from './ModelOutput'

import {
  EXTRA_SMALL_DEVICES,
  SMALL_DEVICES,
  MEDIUM_DEVICES,
  LARGE_DEVICES,
  EXTRA_LARGE_DEVICES,
} from './constants'

class App extends Component {
  state = {status: ''}

  render() {
    return (
      <Root>
        <Navbar />
        <ContentContainer>
          <StatusContainer>
            <StatusLabel>STATUS: </StatusLabel>
            <StatusContent>
              {this.state.status}
            </StatusContent>
          </StatusContainer>
          <ModelInputContainer>
            <ModelInputLabel>MODEL INPUT: </ModelInputLabel>
            <ModelInputContent>
              <ModelInput />
            </ModelInputContent>
          </ModelInputContainer>
          <ModelOutputContainer>
            <ModelOutputLabel>MODEL OUTPUT: </ModelOutputLabel>
            <ModelOutputContent>
              <ModelOutput />
            </ModelOutputContent>
          </ModelOutputContainer>
        </ContentContainer>
      </Root>
    )
  }
}

const Root = styled.div``

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media ${EXTRA_SMALL_DEVICES} {
    height: calc(100vh - 56px);
    width: 100%;
  }

  @media ${SMALL_DEVICES} {
    height: calc(100vh - 56px);
    width: 100%;
  } 

  @media ${MEDIUM_DEVICES} {
    height: calc(100vh - 64px);
    width: 80%;
    margin-left: 10%;
  }

  @media ${LARGE_DEVICES} {
    height: calc(100vh - 64px);
    width: 80%;
    margin-left: 10%;
  }
  
  @media ${EXTRA_LARGE_DEVICES} {
    height: calc(100vh - 64px);
    width: 80%;
    margin-left: 10%;
  }
`

const StatusContainer = styled.div`
  display: flex;
  margin: 15px;
`

const StatusLabel = styled.div`
  line-height: 32px;
`

const StatusContent = styled.div``

const ModelInputContainer = styled.div`
  display: flex;
  margin: 15px;
`

const ModelInputLabel = styled.div`
  line-height: 32px;
`

const ModelInputContent = styled.div``

const ModelOutputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px;
`

const ModelOutputLabel = styled.div`
  line-height: 32px;
`

const ModelOutputContent = styled.div``

export default App
