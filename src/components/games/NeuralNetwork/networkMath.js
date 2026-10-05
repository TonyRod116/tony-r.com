// The same dense equations power inference and the local teaching step.
// Softmax-cross-entropy: dL/dz = p - oneHot(y). ReLU gates the hidden deltas.
export function stableSoftmax(logits) {
  if (!logits.length || logits.some(v => !Number.isFinite(v))) throw new Error('Invalid logits')
  const maximum=Math.max(...logits),exponentials=logits.map(v=>Math.exp(v-maximum))
  const sum=exponentials.reduce((a,b)=>a+b,0)
  return exponentials.map(v=>v/sum)
}
export function crossEntropy(logits,target) {
  if(!logits.length||logits.some(v=>!Number.isFinite(v)))throw new Error('Invalid logits')
  if(!Number.isInteger(target)||target<0||target>=logits.length)throw new Error('Invalid target digit')
  const maximum=Math.max(...logits)
  return (maximum-logits[target])+Math.log(logits.reduce((sum,v)=>sum+Math.exp(v-maximum),0))
}
export function denseForward(weights,biases,normalization,input) {
  if(input.length!==784||Array.from(input).some(v=>!Number.isFinite(v)||v<0||v>1))throw new Error('Expected 784 normalized pixels')
  const pixels=Array.from(input),normalizedInput=pixels.map(v=>(v-normalization.mean)/normalization.std)
  const activations=[pixels],preActivations=[],layerInputs=[]
  let current=normalizedInput
  weights.forEach((matrix,layer)=>{
    layerInputs.push(current)
    const z=matrix.map((row,j)=>row.reduce((sum,w,i)=>sum+w*current[i],biases[layer][j]))
    if(z.some(v=>!Number.isFinite(v)))throw new Error('Non-finite network result')
    preActivations.push(z)
    current=layer<weights.length-1?z.map(v=>Math.max(0,v)):z
    activations.push(current)
  })
  const logits=current,probabilities=stableSoftmax(logits)
  return {normalization:{...normalization},pixels,normalizedInput,layerInputs,preActivations,activations,logits,probabilities,digit:probabilities.indexOf(Math.max(...probabilities))}
}
export function singleTrainingStep(weights,biases,normalization,input,target,learningRate=0.001) {
  if(!Number.isInteger(target)||target<0||target>9)throw new Error('Invalid target digit')
  if(!Number.isFinite(learningRate)||learningRate<=0||learningRate>0.01)throw new Error('Invalid learning rate')
  const before=denseForward(weights,biases,normalization,input),last=weights.length-1
  const deltas=Array(weights.length),weightGradients=Array(weights.length),biasGradients=Array(weights.length)
  let delta=before.probabilities.map((p,j)=>p-Number(j===target))
  let inputGradient
  for(let layer=last;layer>=0;layer--){
    deltas[layer]=delta
    biasGradients[layer]=[...delta]
    weightGradients[layer]=weights[layer].map((row,j)=>row.map((_,i)=>delta[j]*before.layerInputs[layer][i]))
    const previous=weights[layer][0].map((_,i)=>weights[layer].reduce((sum,row,j)=>sum+row[i]*delta[j],0))
    if(layer>0)delta=previous.map((v,i)=>before.preActivations[layer-1][i]>0?v:0)
    else inputGradient=previous.map(v=>v/normalization.std)
  }
  // The base parameters stay untouched. Updates exist only in this local copy.
  const updatedWeights=weights.map((matrix,l)=>matrix.map((row,j)=>row.map((w,i)=>w-learningRate*weightGradients[l][j][i])))
  const updatedBiases=biases.map((row,l)=>row.map((b,j)=>b-learningRate*biasGradients[l][j]))
  const after=denseForward(updatedWeights,updatedBiases,normalization,input)
  return {target,learningRate,before,after,deltas,nodeGradients:[inputGradient,...deltas],weightGradients,biasGradients,updatedWeights,updatedBiases,
    lossBefore:crossEntropy(before.logits,target),lossAfter:crossEntropy(after.logits,target)}
}
// Values used by each visible edge: no invented flow amplitudes.
export function edgeSignal(weights,trace,training,phase,layer,target,source,normalizationStd=0.3081) {
  const weight=weights[layer][target][source]
  const contribution=weight*trace.layerInputs[layer][source]
  const gradient=training?.weightGradients[layer][target][source]
  let value=contribution
  if(phase?.kind==='backward')value=weight*training.deltas[layer][target]/(layer===0?normalizationStd:1)
  if(phase?.kind==='update')value=-training.learningRate*gradient
  return {weight,contribution,gradient,value,updatedWeight:training?.updatedWeights[layer][target][source]}
}
// Las dos conexiones de mayor |peso| de cada neurona (las que dibuja el diagrama).
// Una sola pasada sin crear un objeto por peso ni ordenar. Equivale a ordenar de forma estable por |peso|
// descendente y quedarse con las primeras: en los empates gana el índice menor.
export function strongestConnections(weights, perTarget = 2) {
  const edges = []
  weights.forEach((layerWeights, layer) => layerWeights.forEach((row, target) => {
    const picked = []
    for (let source = 0; source < row.length; source++) {
      const weight = row[source], magnitude = Math.abs(weight)
      let position = picked.length
      while (position > 0 && magnitude > picked[position - 1].magnitude) position--
      if (position < perTarget) {
        picked.splice(position, 0, { source, weight, magnitude })
        if (picked.length > perTarget) picked.pop()
      }
    }
    for (const { source, weight } of picked) edges.push({ source, weight, target, layer })
  }))
  return edges
}
