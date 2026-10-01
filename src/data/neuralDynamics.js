export const TRACE_STEP_MS = 1400
export const forwardSteps = [
  {key:'input',kind:'input',layer:0},
  {key:'f1',kind:'forward',layer:1,edgeLayer:0},
  {key:'f2',kind:'forward',layer:2,edgeLayer:1},
  {key:'f3',kind:'forward',layer:3,edgeLayer:2},
  {key:'softmax',kind:'softmax',layer:3},
]
export const trainingSteps = [...forwardSteps,
  {key:'loss',kind:'loss',layer:3},
  {key:'b2',kind:'backward',layer:2,edgeLayer:2},
  {key:'b1',kind:'backward',layer:1,edgeLayer:1},
  {key:'b0',kind:'backward',layer:0,edgeLayer:0},
  {key:'update',kind:'update',layer:null},
  {key:'after',kind:'after',layer:3},
]
// A joint view is an inspection of the completed calculation, not a claim
// that the sequential layers execute at the same time.
export function inspectionPhase(direction, layer) {
  if (layer === null) return {key: direction === 'backward' ? 'allBackward' : 'allForward', kind: direction, layer: null, edgeLayers: [0,1,2]}
  if (direction === 'backward') return layer === 3
    ? {key:'outputGradient',kind:'backward',layer:3}
    : {key:`b${layer}`,kind:'backward',layer,edgeLayer:layer}
  return layer === 3 ? {...forwardSteps[4],edgeLayer:2} : forwardSteps[layer]
}
export const neuralControls = {
 es:{direction:'Sentido del cálculo',forward:'Hacia delante',backward:'Backpropagation',all:'Todas las etapas',layers:'Etapas del cálculo',animation:'Animación',on:'Encendida',off:'Apagada',enable:'Encender animación',disable:'Apagar animación',running:'En marcha',paused:'Pausada',layerHint:'Elige una etapa o todas. Cambiar de vista conserva la pausa y el encendido.',inspection:'Vista en detalle'},
 en:{direction:'Calculation direction',forward:'Forward pass',backward:'Backpropagation',all:'All stages',layers:'Calculation stages',animation:'Animation',on:'On',off:'Off',enable:'Turn animation on',disable:'Turn animation off',running:'Running',paused:'Paused',layerHint:'Choose one stage or all. Changing the view keeps your pause and on/off settings.',inspection:'Detailed view'},
 ca:{direction:'Sentit del càlcul',forward:'Cap endavant',backward:'Backpropagation',all:'Totes les etapes',layers:'Etapes del càlcul',animation:'Animació',on:'Encesa',off:'Apagada',enable:'Encendre animació',disable:'Apagar animació',running:'En marxa',paused:'Pausada',layerHint:'Tria una etapa o totes. Canviar de vista conserva la pausa i l’encesa.',inspection:'Vista en detall'},
}
export const neuralDynamics = {
 es:{training:'Ver un paso de entrenamiento',target:'Número correcto',play:'Continuar animación',pause:'Pausar animación',step:'Paso siguiente',stop:'Terminar recorrido',modeInference:'Predicción',modeTraining:'Entrenamiento · copia local',afterCopy:'Copia después del paso',gradient:'Gradiente',weight:'Peso',contribution:'Aportación',normalization:'Valor normalizado',lossBefore:'Pérdida antes',lossAfter:'Pérdida después',learningRate:'Paso de aprendizaje',trainingNote:'Este paso ajusta una copia local con el número que indicas. El modelo original se conserva; un solo dibujo no mide su precisión general.',animationNote:'La red calcula al instante. La animación recorre a cámara lenta sus valores reales y una selección de conexiones.',legend:'Lima: valor positivo · Naranja: negativo · Brillo: magnitud relativa.',error:'No se ha podido preparar el paso. Prueba con otro dibujo.',
 phases:{
 allForward:['Todo el recorrido de ida','x̃ → ReLU → ReLU → softmax','Vista conjunta de las aportaciones reales de tu dibujo. Las capas se calculan en orden; aquí puedes observar todos sus enlaces a la vez.'],
 allBackward:['Todo el recorrido de vuelta','δ³ = p − y → δ² → δ¹ → ∂L/∂x','Vista conjunta de los gradientes reales para el número correcto que indicas. El cálculo parte de la salida y vuelve hacia la entrada.'],
 outputGradient:['El error en las diez salidas','∂L/∂z³ = p − oneHot(y)','A la probabilidad del número correcto se le resta 1. Este gradiente de la pérdida inicia el recorrido hacia atrás.'],
 input:['La imagen entra','x̃ = (x − 0.1307) / 0.3081','Los 784 píxeles se normalizan antes de entrar en las capas.'],
 f1:['Primera capa','a¹ = ReLU(W¹x̃ + b¹)','Cada neurona suma las aportaciones de sus entradas y su sesgo. ReLU deja pasar los valores positivos.'],
 f2:['Segunda capa','a² = ReLU(W²a¹ + b²)','Las activaciones anteriores alimentan esta capa. Los enlaces apagados aportan cero.'],
 f3:['Diez puntuaciones','z³ = W³a² + b³','Cada salida recibe una puntuación calculada con sus pesos y su sesgo.'],
 softmax:['La predicción','p = softmax(z³)','Las diez puntuaciones se convierten en probabilidades que suman 1.'],
 loss:['Comparar con tu respuesta','L = −log p(y)','La pérdida mide cuánto se aleja la predicción del número que has indicado.'],
 b2:['El gradiente vuelve','δ³ = p − y; δ² = (W³ᵀδ³) ⊙ ReLU′','El error atraviesa los enlaces hacia atrás. ReLU bloquea el gradiente de las neuronas desactivadas.'],
 b1:['Hacia la primera capa','δ¹ = (W²ᵀδ²) ⊙ ReLU′','Se aplica la regla de la cadena usando los mismos pesos del cálculo inicial.'],
 b0:['Sensibilidad de la imagen','∂L/∂x = W¹ᵀδ¹ / 0.3081','Se calcula cómo influye cada píxel. El entrenamiento ajusta los pesos y sesgos; conserva la imagen.'],
 update:['Ajustar la copia','w′ = w − 0.001 · ∂L/∂w','Cada enlace cambia según su gradiente real. También se ajustan los sesgos.'],
 after:['Comprobar el paso','L antes → L después','La copia vuelve a calcular la predicción. Los valores muestran el resultado real de ese paso.'],
 }},
 en:{training:'Show one training step',target:'Correct digit',play:'Resume animation',pause:'Pause animation',step:'Next step',stop:'End trace',modeInference:'Inference',modeTraining:'Training · local copy',afterCopy:'Copy after the step',gradient:'Gradient',weight:'Weight',contribution:'Contribution',normalization:'Normalized value',lossBefore:'Loss before',lossAfter:'Loss after',learningRate:'Learning rate',trainingNote:'This step updates a local copy using your label. The original model is preserved; one drawing does not measure its general accuracy.',animationNote:'The network computes instantly. The animation slowly traces its actual values and a selection of connections.',legend:'Lime: positive · Orange: negative · Brightness: relative magnitude.',error:'Could not prepare the step. Try another drawing.',
 phases:{
 allForward:['The full forward pass','x̃ → ReLU → ReLU → softmax','A joint view of your drawing’s actual contributions. Layers compute in order; this view lets you inspect all their connections together.'],
 allBackward:['The full backward pass','δ³ = p − y → δ² → δ¹ → ∂L/∂x','A joint view of actual gradients for your chosen label. The calculation starts at the output and travels back to the input.'],
 outputGradient:['The error in ten outputs','∂L/∂z³ = p − oneHot(y)','Subtract 1 from the probability of the correct digit. This loss gradient starts the backward pass.'],
 input:['The image enters','x̃ = (x − 0.1307) / 0.3081','The 784 pixels are normalized before entering the layers.'],
 f1:['First layer','a¹ = ReLU(W¹x̃ + b¹)','Each neuron adds its weighted inputs and bias. ReLU passes positive values.'],
 f2:['Second layer','a² = ReLU(W²a¹ + b²)','The previous activations feed this layer. Inactive links contribute zero.'],
 f3:['Ten scores','z³ = W³a² + b³','Each output receives a score computed from its weights and bias.'],
 softmax:['The prediction','p = softmax(z³)','The ten scores become probabilities that sum to 1.'],
 loss:['Compare with your answer','L = −log p(y)','Loss measures the mismatch with the digit you labelled.'],
 b2:['The gradient returns','δ³ = p − y; δ² = (W³ᵀδ³) ⊙ ReLU′','The gradient travels backwards through connections. ReLU blocks inactive neurons.'],
 b1:['Towards the first layer','δ¹ = (W²ᵀδ²) ⊙ ReLU′','The chain rule uses the same weights as the initial forward pass.'],
 b0:['Image sensitivity','∂L/∂x = W¹ᵀδ¹ / 0.3081','Each pixel’s influence is computed. Training updates weights and biases while preserving the image.'],
 update:['Update the copy','w′ = w − 0.001 · ∂L/∂w','Each connection changes according to its actual gradient. Biases are updated too.'],
 after:['Check the step','L before → L after','The copy computes its prediction again, showing the actual outcome of that step.'],
 }},
 ca:{training:'Veure un pas d’entrenament',target:'Número correcte',play:'Continuar animació',pause:'Pausar animació',step:'Pas següent',stop:'Acabar recorregut',modeInference:'Predicció',modeTraining:'Entrenament · còpia local',afterCopy:'Còpia després del pas',gradient:'Gradient',weight:'Pes',contribution:'Aportació',normalization:'Valor normalitzat',lossBefore:'Pèrdua abans',lossAfter:'Pèrdua després',learningRate:'Pas d’aprenentatge',trainingNote:'Aquest pas ajusta una còpia local amb el número que indiques. El model original es conserva; un dibuix no mesura la precisió general.',animationNote:'La xarxa calcula a l’instant. L’animació recorre a càmera lenta els valors reals i una selecció de connexions.',legend:'Llima: positiu · Taronja: negatiu · Brillantor: magnitud relativa.',error:'No s’ha pogut preparar el pas. Prova amb un altre dibuix.',
 phases:{
 allForward:['Tot el recorregut d’anada','x̃ → ReLU → ReLU → softmax','Vista conjunta de les aportacions reals del dibuix. Les capes es calculen en ordre; aquí pots observar tots els enllaços alhora.'],
 allBackward:['Tot el recorregut de tornada','δ³ = p − y → δ² → δ¹ → ∂L/∂x','Vista conjunta dels gradients reals per al número correcte que indiques. El càlcul comença a la sortida i torna cap a l’entrada.'],
 outputGradient:['L’error a les deu sortides','∂L/∂z³ = p − oneHot(y)','Es resta 1 de la probabilitat del número correcte. Aquest gradient de la pèrdua inicia el recorregut enrere.'],
 input:['Entra la imatge','x̃ = (x − 0.1307) / 0.3081','Els 784 píxels es normalitzen abans d’entrar a les capes.'],
 f1:['Primera capa','a¹ = ReLU(W¹x̃ + b¹)','Cada neurona suma entrades ponderades i biaix. ReLU deixa passar els valors positius.'],
 f2:['Segona capa','a² = ReLU(W²a¹ + b²)','Les activacions anteriors alimenten aquesta capa. Els enllaços apagats aporten zero.'],
 f3:['Deu puntuacions','z³ = W³a² + b³','Cada sortida rep una puntuació calculada amb pesos i biaix.'],
 softmax:['La predicció','p = softmax(z³)','Les deu puntuacions es converteixen en probabilitats que sumen 1.'],
 loss:['Comparar amb la resposta','L = −log p(y)','La pèrdua mesura la diferència amb el número que has indicat.'],
 b2:['El gradient torna','δ³ = p − y; δ² = (W³ᵀδ³) ⊙ ReLU′','El gradient travessa els enllaços enrere. ReLU bloqueja les neurones desactivades.'],
 b1:['Cap a la primera capa','δ¹ = (W²ᵀδ²) ⊙ ReLU′','La regla de la cadena utilitza els pesos del càlcul inicial.'],
 b0:['Sensibilitat de la imatge','∂L/∂x = W¹ᵀδ¹ / 0.3081','Es calcula la influència de cada píxel. S’ajusten pesos i biaixos mentre es conserva la imatge.'],
 update:['Ajustar la còpia','w′ = w − 0.001 · ∂L/∂w','Cada enllaç canvia segons el gradient real. També s’ajusten els biaixos.'],
 after:['Comprovar el pas','L abans → L després','La còpia torna a calcular la predicció i mostra el resultat real del pas.'],
 }},
}
