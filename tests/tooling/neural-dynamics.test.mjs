import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {MLP} from '../../src/components/games/NeuralNetwork/mlp.js'
import {denseForward,crossEntropy,singleTrainingStep} from '../../src/components/games/NeuralNetwork/networkMath.js'

function tiny() {
  const weights=[Array.from({length:2},()=>Array(784).fill(0)),[[0.5,0.25],[-0.25,0.5]],Array.from({length:10},(_,j)=>[(j-4)/16,(5-j)/16])]
  weights[0][0][0]=0.5;weights[0][0][1]=-0.25;weights[0][1][0]=-0.5;weights[0][1][1]=0.25
  const biases=[[0.25,0.125],[0.125,0.25],Array(10).fill(0)]
  const input=Array(784).fill(0);input[0]=0.8;input[1]=0.2;input[100]=0.4
  return {weights,biases,input,normalization:{mean:0,std:2}}
}
test('backprop weights/biases/input agree with independent central finite differences',()=>{
  const {weights,biases,input,normalization}=tiny(),target=3
  const step=singleTrainingStep(weights,biases,normalization,input,target)
  const loss=()=>crossEntropy(denseForward(weights,biases,normalization,input).logits,target)
  const derivative=(array,index)=>{const original=array[index],eps=1e-5;array[index]=original+eps;const plus=loss();array[index]=original-eps;const minus=loss();array[index]=original;return (plus-minus)/(2*eps)}
  for(let l=0;l<3;l++)for(let j=0;j<weights[l].length;j++){
    const indices=l===0?[0,1,100]:weights[l][j].map((_,i)=>i)
    for(const i of indices)assert.ok(Math.abs(derivative(weights[l][j],i)-step.weightGradients[l][j][i])<3e-7,`W${l}[${j},${i}]`)
    assert.ok(Math.abs(derivative(biases[l],j)-step.biasGradients[l][j])<3e-7,`bias${l}[${j}]`)
  }
  for(const i of [0,1,100])assert.ok(Math.abs(derivative(input,i)-step.nodeGradients[0][i])<3e-7,`normalized input derivative ${i}`)
})
test('inactive ReLU blocks its delta and incoming parameter gradients',()=>{
  const {weights,biases,input,normalization}=tiny(),step=singleTrainingStep(weights,biases,normalization,input,3)
  assert.ok(step.before.preActivations[0][1]<0);assert.equal(step.deltas[0][1],0)
  assert.ok(step.weightGradients[0][1].every(v=>v===0));assert.equal(step.biasGradients[0][1],0)
  assert.ok(Math.abs(step.deltas[2].reduce((a,b)=>a+b,0))<1e-12)
})
test('one SGD step uses exact gradients, keeps the base unchanged and measures its actual loss',()=>{
  const {weights,biases,input,normalization}=tiny(),saved=JSON.stringify({weights,biases}),rate=0.001
  const step=singleTrainingStep(weights,biases,normalization,input,3,rate)
  assert.equal(JSON.stringify({weights,biases}),saved)
  for(let l=0;l<3;l++)for(let j=0;j<weights[l].length;j++)for(let i=0;i<weights[l][j].length;i++)assert.equal(step.updatedWeights[l][j][i],weights[l][j][i]-rate*step.weightGradients[l][j][i])
  assert.equal(step.lossAfter,crossEntropy(step.after.logits,3));assert.ok(step.lossAfter<step.lossBefore)
})
test('the real model training preview never modifies pretrained weights or its last inference',()=>{
  const model=new MLP(JSON.parse(readFileSync(new URL('../../public/models/mnist/014_dataset-1x.json',import.meta.url),'utf8')))
  const input=Array(784).fill(0);input[400]=1;const logits=model.forward(input),activations=model.getActivations()
  const original=JSON.stringify({weights:model.weights,biases:model.biases})
  const step=model.trainingStep(input,7)
  assert.equal(JSON.stringify({weights:model.weights,biases:model.biases}),original)
  assert.strictEqual(model.getActivations(),activations);assert.deepEqual(model.trace(input).logits,logits)
  assert.equal(step.nodeGradients.length,4);assert.deepEqual(step.nodeGradients.map(v=>v.length),[784,128,64,10])
  assert.ok(Number.isFinite(step.lossBefore)&&Number.isFinite(step.lossAfter))
  assert.ok(step.weightGradients.flat(2).every(Number.isFinite))
})
test('training rejects invalid supervision/rates and cannot run without a real model',()=>{
  const t=tiny()
  for(const target of [-1,10,NaN,2.5])assert.throws(()=>singleTrainingStep(t.weights,t.biases,t.normalization,t.input,target))
  for(const rate of [0,-1,NaN,1])assert.throws(()=>singleTrainingStep(t.weights,t.biases,t.normalization,t.input,3,rate))
  assert.throws(()=>new MLP().trainingStep(t.input,3),/not loaded/)
})
test('edge values use normalized forward inputs and actual backward/SGD quantities',async()=>{
  const {edgeSignal}=await import('../../src/components/games/NeuralNetwork/networkMath.js')
  const {weights,biases,input,normalization}=tiny(),step=singleTrainingStep(weights,biases,normalization,input,3)
  const forward=edgeSignal(weights,step.before,step,{kind:'forward'},0,0,0,normalization.std)
  assert.equal(forward.value,weights[0][0][0]*(input[0]/2))
  for(const i of [0,1,100]){
    const sum=weights[0].reduce((v,_,j)=>v+edgeSignal(weights,step.before,step,{kind:'backward'},0,j,i,normalization.std).value,0)
    assert.ok(Math.abs(sum-step.nodeGradients[0][i])<1e-12)
  }
  const update=edgeSignal(weights,step.before,step,{kind:'update'},2,3,0,normalization.std)
  assert.equal(update.value,-step.learningRate*step.weightGradients[2][3][0])
  assert.equal(update.updatedWeight,step.updatedWeights[2][3][0])
})
