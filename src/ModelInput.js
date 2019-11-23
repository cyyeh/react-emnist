import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { Input } from '@material-ui/core'

class ModelInput extends Component {
  render() {
    return (
      <InputContainer>
        <Input type="file"/>
      </InputContainer>
    )
  }
}

const InputContainer = styled(Box)`
  margin-left: 20px;
  margin-right: 20px;
`

export default ModelInput