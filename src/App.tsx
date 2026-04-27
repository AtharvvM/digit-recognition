import DrawingCanvas from './components/DrawingCanvas';
import { useDigitRecognition } from './hooks/useDigitRecognition';
import { BrainCircuit, Eraser, Loader2, Code2, ExternalLink } from 'lucide-react';

function App() {
  const { predict, prediction, confidence, isLoading, error, setPrediction } = useDigitRecognition();

  const handleDraw = (canvas: HTMLCanvasElement) => {
    predict(canvas);
  };

  const handleClear = () => {
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                DigitAI
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Neural Network Recognition</p>
            </div>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-all text-sm font-medium border border-slate-700"
          >
            <Code2 className="w-4 h-4" />
            <span>Source</span>
          </a>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Drawing Area */}
        <section className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white leading-tight">Handwritten Digit Recognition</h2>
            <p className="text-slate-400 max-w-md mx-auto lg:mx-0">
              Draw any digit from 0 to 9 on the canvas below. The AI will process it and provide a prediction with confidence levels.
            </p>
          </div>

          <div className="bg-slate-800/50 p-6 lg:p-8 rounded-3xl border border-slate-700 shadow-xl backdrop-blur-sm flex flex-col items-center">
            {isLoading ? (
              <div className="h-[340px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-400 animate-pulse font-medium">Loading AI Model...</p>
              </div>
            ) : error ? (
              <div className="h-[340px] flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-500/10 rounded-full">
                  <Eraser className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-red-400 max-w-[250px]">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <DrawingCanvas onDraw={handleDraw} onClear={handleClear} />
            )}
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-4 items-start">
            <div className="mt-1 p-1 bg-indigo-500/20 rounded-md">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-sm text-indigo-200/80 leading-relaxed">
              <strong>Tip:</strong> Draw clear, thick lines. The model performs best when the digit is centered and occupies a significant portion of the canvas.
            </p>
          </div>
        </section>

        {/* Right Column: Prediction Results */}
        <section className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-150 h-full">
          <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 lg:p-10 h-full min-h-[400px] flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group transition-all hover:border-indigo-500/30">
            {/* Background decorative element */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700"></div>

            {prediction !== null ? (
              <div className="relative z-10 space-y-6 w-full flex flex-col items-center">
                <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">Prediction Result</span>
                <div className="text-[10rem] lg:text-[12rem] font-black leading-none text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] bg-clip-text">
                  {prediction}
                </div>
                <div className="space-y-3 w-full max-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Confidence</span>
                    <span className="text-indigo-300 font-mono text-sm font-bold">
                      {Math.round((confidence || 0) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{ width: `${(confidence || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center gap-6 opacity-60">
                <div className="w-32 h-32 border-4 border-dashed border-slate-600 rounded-full flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-300">Ready for Input</h3>
                  <p className="text-slate-500 mt-2 max-w-[200px] mx-auto">Start drawing on the left to see the AI prediction</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Model Type</h4>
              <p className="text-slate-200 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                CNN (TensorFlow.js)
              </p>
            </div>
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
              <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Dataset</h4>
              <p className="text-slate-200 font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                MNIST Digit Data
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-10 px-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-slate-500 text-sm">
            DigitAI — An experimental project exploring client-side Machine Learning.
          </p>
          <div className="flex justify-center gap-6 text-slate-500 text-xs font-medium uppercase tracking-widest">
            <a href="https://github.com" className="hover:text-indigo-400 transition-colors">Source Code</a>
            <span className="text-slate-800">•</span>
            <a href="https://js.tensorflow.org" className="hover:text-indigo-400 transition-colors">TF.js Docs</a>
            <span className="text-slate-800">•</span>
            <a href="#" className="hover:text-indigo-400 transition-colors">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
