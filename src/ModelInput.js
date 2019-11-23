import React, { Component } from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import { Input } from '@material-ui/core'

import {
  IMAGE_SIZE,
} from './constants'

class ModelInput extends Component {
  onFileChange(files, onFileUpload) {
    for (let i = 0, f; f = files[i]; i++) {
      // Only process image files
      if (!f.type.match('image.*')) {
        continue
      }

      let reader = new FileReader()
      reader.onload = e => {
        // Fill the image & call predict
        let img = document.createElement('img')
        img.src = e.target.result
        img.width = IMAGE_SIZE
        img.height = IMAGE_SIZE
        img.onload = () => onFileUpload(img)
      }

      // Read in the image file as a data URL.
      reader.readAsDataURL(f)
    }
  }

  render() {
    const {
      onFileUpload,
    } = this.props

    return (
      <InputContainer>
        <Input 
          type="file"
          accept="image/*"
          onChange={
            e => this.onFileChange(e.target.files, onFileUpload)
          }
        />
      </InputContainer>
    )
  }
}

const InputContainer = styled(Box)`
  margin-left: 20px;
  margin-right: 20px;
`

export default ModelInput