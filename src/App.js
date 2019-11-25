import React, { Component } from 'react'
import styled from 'styled-components'
import * as tf from '@tensorflow/tfjs'

import Navbar from './Navbar'
import ModelInput from './ModelInput'
import ModelOutput from './ModelOutput'

import {
  EXTRA_SMALL_DEVICES,
  SMALL_DEVICES,
  MEDIUM_DEVICES,
  LARGE_DEVICES,
  EXTRA_LARGE_DEVICES,

  STATUS_LOADING,
  STATUS_PREDICTION_FINISHED,
  STATUS_PREDICTION_ING,

  LATEST_MODEL_ID,

  MOBILENET_MODEL_PATH,

  IMAGE_SIZE,
  TOPK_PREDICTIONS,
} from './constants'

import {
  IMAGENET_CLASSES
} from './imagenet_classes'

let mobilenet

class App extends Component {
  constructor(props) {
    super(props)

    this.predictWrapper = this.predictWrapper.bind(this)
  }

  state = {
    status: '',
    predictionStatistics: '',
    predictions: [],
  }

  componentDidMount() {
    this.initializeModelPrediction()
  }

  initializeModelPrediction() {
    this.setState({
      status: STATUS_LOADING,
    }, async () => {
      mobilenet = await tf.loadLayersModel(MOBILENET_MODEL_PATH)

      this.setState({
        status: STATUS_PREDICTION_ING,
      }, () => {
        // Warmup the model. This isn't necessary, but makes the first prediction
        // faster. Call `dispose` to release the WebGL memory allocated for the return
        // value of `predict`.
        mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose()

        // Make a prediction through the locally hosted cat.jpg.
        const latestModelElement = document.getElementById(LATEST_MODEL_ID)
        if (latestModelElement) {
          this.predictWrapper(latestModelElement)
        } else {
          latestModelElement.onload = () => {
            this.predictWrapper(latestModelElement)
          }
        }
      })
    })
  }

  predictWrapper(element) {
    this.predict(element, topClassesWithProbs => {
      this.setState({
        status: STATUS_PREDICTION_FINISHED,
        predictions: [{
          imgElement: element,
          topClassesWithProbs,
        }, ...this.state.predictions]
      })
    })
  }

  /**
   * Given an image element, makes a prediction through mobilenet returning the
   * probabilities of the top K classes.
   */
  predict(imgElement, callback) {
    this.setState({
      status: STATUS_PREDICTION_ING,
    }, async () => {
      // The first start time includes the time it takes to extract the image
      // from the HTML and preprocess it, in additon to the predict() call.
      const startTime1 = performance.now()
      // The second start time excludes the extraction and preprocessing and
      // includes only the predict() call.
      let startTime2

      const logits = tf.tidy(() => {
        // tf.browser.fromPixels() returns a Tensor from an image element.
        const img = tf.browser.fromPixels(imgElement).toFloat()

        const offset = tf.scalar(127.5)
        // Normalize the image from [0, 255] to [-1, 1]
        const normalized = img.sub(offset).div(offset)

        // Reshape to a single-element batch so we can pass it to predict.
        const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3])

        startTime2 = performance.now()
        // Make a prediction through mobilenet.
        return mobilenet.predict(batched)
      })

      // Convert logits to probabilities and class names.
      const classesWithProbs = await this.getTopKClassesWithProbs(logits, TOPK_PREDICTIONS)
      const totalTime1 = performance.now() - startTime1
      const totalTime2 = performance.now() - startTime2
      this.setState({
        predictionStatistics: 
        `Done in ${Math.floor(totalTime1)} ms ` +
        `(not including preprocessing: ${Math.floor(totalTime2)} ms)`
      }, () => {
        if (callback) {
          callback(classesWithProbs)
        }
      })
    })
  }

  /**
   * Computes the probabilities of the topK classes given logits by computing
   * softmax to get probabilities and then sorting the probabilities.
   * @param logits Tensor representing the logits from MobileNet.
   * @param topK The number of top predictions to show.
   */
  async getTopKClassesWithProbs(logits, topK) {
    const data = await logits.data()
    const { values, indices } = tf.topk(data, topK, true)
    let topKValues = await values.data()
    let topKIndices = await indices.data()

    const topClassesWithProbs = []
    for (let i = 0; i < topKIndices.length; i++) {
      topClassesWithProbs.push({
        className: IMAGENET_CLASSES[topKIndices[i]],
        probability: topKValues[i],
      })
    }

   return topClassesWithProbs
  }

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
              <ModelInput 
                onFileUpload={this.predictWrapper}
              />
            </ModelInputContent>
          </ModelInputContainer>
          <ModelOutputContainer>
            <ModelOutputLabel>MODEL OUTPUT: </ModelOutputLabel>
            <ModelOutputContent>
              {this.state.status === STATUS_PREDICTION_FINISHED &&
                <ModelOutputStatus>
                  {this.state.predictionStatistics}
                </ModelOutputStatus>
              }
              <ModelOutput 
                loading={this.state.status !== STATUS_PREDICTION_FINISHED ? true : false}
                predictions={this.state.predictions}
              />
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

const StatusContent = styled.div`
  line-height: 32px;
  margin-left: 15px;
`

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

const ModelOutputContent = styled.div`
  display: flex;
  flex-direction: column;
`

const ModelOutputStatus = styled.div`
  margin-bottom: 15px;
`

export default App
