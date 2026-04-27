import { useState, useEffect, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';

// Using a reliable CDN for the model and weights
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/GantMan/mnist-tfjs@master/model.json';

export const useDigitRecognition = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(MODEL_URL);
        setModel(loadedModel);
        setIsLoading(false);
        console.log('Model loaded successfully');
      } catch (err) {
        console.error('Failed to load model:', err);
        setError('Failed to load the recognition model. Please check your connection.');
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const predict = useCallback(async (canvas: HTMLCanvasElement) => {
    if (!model) return;

    // Preprocessing
    const tensor = tf.tidy(() => {
      // 1. Get image from canvas
      const img = tf.browser.fromPixels(canvas, 1); // 1 channel (grayscale)
      
      // 2. Resize to 28x28 (MNIST input size)
      const resized = tf.image.resizeBilinear(img, [28, 28]);
      
      // 3. Normalize values from [0, 255] to [0, 1]
      const normalized = resized.div(255.0);
      
      // 4. Handle different model input shapes
      const inputShape = model.inputs[0].shape;
      if (inputShape && inputShape.length === 2 && inputShape[1] === 784) {
        // Flattened input: [batch, 784]
        return normalized.reshape([1, 784]);
      } else {
        // standard CNN input: [batch, 28, 28, 1]
        return normalized.expandDims(0);
      }
    });

    try {
      const output = model.predict(tensor) as tf.Tensor;
      const predictions = await output.data();
      
      const maxConfidence = Math.max(...Array.from(predictions));
      const predictedDigit = Array.from(predictions).indexOf(maxConfidence);

      setPrediction(predictedDigit);
      setConfidence(maxConfidence);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      tensor.dispose();
    }
  }, [model]);

  return { predict, prediction, confidence, isLoading, error, setPrediction };
};
