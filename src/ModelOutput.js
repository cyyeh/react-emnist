import React, { Component } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@material-ui/core'

import {
  LATEST_MODEL_CONTAINER_ID,
  LATEST_MODEL_ID,
} from './constants'

import catImage from './cat.jpg'

const Predictions = ({ predictions }) => (
  predictions.map((prediction, index) => (
    <ModelCard key={index}>
      <CardPhoto
        component="img"
        image={prediction.imgElement.src}
        width={224}
        height={224}
      />
      <CardContent>
        <PredictionClassesWithProbs 
          topClassesWithProbs={prediction.topClassesWithProbs || []} 
        />
      </CardContent>
    </ModelCard>
  ))
)

const PredictionClassesWithProbs = ({ topClassesWithProbs }) => (
  <PredictionClassesWithProbsList>
  {
    topClassesWithProbs.map((topClassWithProb, index) => (
      <PredictionClassesWithProbsItem key={index}>
        <PredictionClassLabel>{topClassWithProb.className}</PredictionClassLabel>
        <PredictionClassProb>{topClassWithProb.probability.toFixed(2)}</PredictionClassProb>
      </PredictionClassesWithProbsItem>
    ))
  }
  </PredictionClassesWithProbsList>
)

class ModelOutput extends Component {
  render() {
    const {
      loading,
      predictions,
    } = this.props

    console.log(predictions)

    return (
      <ModelOutputContainer>
        <LatestOutputContainer>
          {loading &&
            <CircularProgress />
          }
          <LatestModelCard
            id={LATEST_MODEL_CONTAINER_ID}
            ishidden={loading ? 1 : 0}
          >
            <CardPhoto
              component="img"
              id={LATEST_MODEL_ID}
              image={predictions.length < 2 ? catImage : predictions[0].imgElement.src}
              width={224}
              height={224}
            />
            <CardContent>
              <PredictionClassesWithProbs 
                topClassesWithProbs={
                  predictions.length > 0 ? 
                  predictions[0].topClassesWithProbs : 
                  []
                } 
              />
            </CardContent>
          </LatestModelCard>
        </LatestOutputContainer>
        <OtherOutputsContainer>
          {predictions.length >= 2 &&
            <Predictions
              predictions={predictions.slice(1, predictions.length)}
            />
          }
        </OtherOutputsContainer>
      </ModelOutputContainer>
    )
  }
}

const ModelOutputContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const LatestOutputContainer = styled.div`
  display: flex;
  justify-content: center;
`

const LatestModelCard = styled(Card)`
  width: 300px;

  display: ${props => props.ishidden === 1 ? 'none' : 'block'};
`

const CardPhoto = styled(CardMedia)``

const OtherOutputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
`

const ModelCard = styled(Card)`
  width: 300px;
  margin: 15px;
`

const PredictionClassesWithProbsList = styled.ul`
  padding-inline-start: 0px;
`

const PredictionClassesWithProbsItem = styled.li`
  display: flex;
  padding: 5px;
`

const PredictionClassLabel = styled.div`
  flex: 1;
`

const PredictionClassProb = styled.div``

export default ModelOutput