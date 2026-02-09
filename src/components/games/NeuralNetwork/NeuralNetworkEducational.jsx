import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronDown, Pencil, Grid3X3, BarChart3, Zap, Brain, Target, Layers, TrendingUp } from 'lucide-react'
import { useLanguage } from '../../../hooks/useLanguage.jsx'

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

// Annotation badge component
function Badge({ n }) {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex-shrink-0">
      {n}
    </span>
  )
}

// Expandable card component
function ExpandableCard({ title, children, borderColor = 'border-blue-500' }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 border-l-4 ${borderColor} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-700/20 transition-colors"
      >
        <span className="font-semibold text-white">{title}</span>
        {open
          ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-300 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export default function NeuralNetworkEducational() {
  const { t } = useLanguage()

  const ed = (key) => t(`neuralNetwork.education.${key}`) || key

  return (
    <div className="mt-12">
      {/* Separator */}
      <div className="flex items-center gap-4 mb-16">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">
          {ed('learnMore')}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
      </div>

      {/* SECTION 1: Training Code */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.div variants={fadeIn} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {ed('howTrained.title')}
          </h2>
          <p className="text-gray-400">
            {ed('howTrained.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Code Block */}
          <motion.div variants={fadeIn} className="relative min-w-0">
            <div className="bg-[#0d1117] border border-gray-700/50 rounded-xl overflow-hidden min-w-0">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-gray-500 font-mono">Python / TensorFlow</span>
              </div>
              <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono min-w-0 w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
                <code className="block min-w-max">
                  <Line><Kw>import</Kw> tensorflow <Kw>as</Kw> tf</Line>
                  <Line><Kw>from</Kw> tensorflow.keras.layers <Kw>import</Kw> <Fn>Dense</Fn></Line>
                  <Line />
                  <Line>model = <Fn>Sequential</Fn>([</Line>
                  <AnnotatedLine n={1}>{'  '}tf.keras.<Fn>Input</Fn>(shape=(<Num>784</Num>,)),</AnnotatedLine>
                  <AnnotatedLine n={2}>{'  '}<Fn>Dense</Fn>(<Num>64</Num>, activation=<Str>"relu"</Str>),</AnnotatedLine>
                  <AnnotatedLine n={3}>{'  '}<Fn>Dense</Fn>(<Num>32</Num>, activation=<Str>"relu"</Str>),</AnnotatedLine>
                  <AnnotatedLine n={4}>{'  '}<Fn>Dense</Fn>(<Num>10</Num>, activation=<Str>"softmax"</Str>),</AnnotatedLine>
                  <Line>])</Line>
                  <Line />
                  <AnnotatedLine n={5}>model.<Fn>compile</Fn>(</AnnotatedLine>
                  <Line>{'  '}loss=<Fn>SparseCategoricalCrossentropy</Fn>(),</Line>
                  <Line>{'  '}optimizer=<Fn>Adam</Fn>(<Num>0.001</Num>),</Line>
                  <Line>)</Line>
                  <Line />
                  <AnnotatedLine n={6}>model.<Fn>fit</Fn>(X, y, epochs=<Num>40</Num>)</AnnotatedLine>
                </code>
              </pre>
            </div>
          </motion.div>

          {/* Annotations */}
          <motion.div variants={stagger} className="space-y-3">
            <AnnotationCard n={1} borderColor="border-l-blue-500" title={ed('ann1.title')}>
              {ed('ann1.text')}
            </AnnotationCard>
            <AnnotationCard n={2} borderColor="border-l-green-500" title={ed('ann2.title')}>
              {ed('ann2.text')}
            </AnnotationCard>
            <AnnotationCard n={3} borderColor="border-l-green-500" title={ed('ann3.title')}>
              {ed('ann3.text')}
            </AnnotationCard>
            <AnnotationCard n={4} borderColor="border-l-purple-500" title={ed('ann4.title')}>
              {ed('ann4.text')}
            </AnnotationCard>
            <AnnotationCard n={5} borderColor="border-l-orange-500" title={ed('ann5.title')}>
              {ed('ann5.text')}
            </AnnotationCard>
            <AnnotationCard n={6} borderColor="border-l-red-500" title={ed('ann6.title')}>
              {ed('ann6.text')}
            </AnnotationCard>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 2: Architecture */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.div variants={fadeIn} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {ed('architecture.title')}
          </h2>
          <p className="text-gray-400">
            {ed('architecture.subtitle')}
          </p>
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div variants={fadeIn} className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-0 mb-12">
          <ArchBox
            label={ed('arch.input')}
            neurons="784"
            sub="28 x 28 px"
            color="from-blue-600/20 to-blue-800/20"
            borderColor="border-blue-500/50"
          />
          <Arrow />
          <ArchBox
            label={ed('arch.hidden1')}
            neurons="64"
            sub="ReLU"
            color="from-green-600/20 to-green-800/20"
            borderColor="border-green-500/50"
          />
          <Arrow />
          <ArchBox
            label={ed('arch.hidden2')}
            neurons="32"
            sub="ReLU"
            color="from-green-600/20 to-green-800/20"
            borderColor="border-green-500/50"
          />
          <Arrow />
          <ArchBox
            label={ed('arch.output')}
            neurons="10"
            sub="Softmax"
            color="from-purple-600/20 to-purple-800/20"
            borderColor="border-purple-500/50"
          />
        </motion.div>

        {/* Concept Cards */}
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fadeIn}>
            <ConceptCard
              icon={<Layers className="h-6 w-6" />}
              title={ed('concepts.dense.title')}
              text={ed('concepts.dense.text')}
              color="text-blue-400"
              bg="bg-blue-500/10"
            />
          </motion.div>
          <motion.div variants={fadeIn}>
            <ConceptCard
              icon={<Zap className="h-6 w-6" />}
              title={ed('concepts.relu.title')}
              text={ed('concepts.relu.text')}
              color="text-green-400"
              bg="bg-green-500/10"
            />
          </motion.div>
          <motion.div variants={fadeIn}>
            <ConceptCard
              icon={<BarChart3 className="h-6 w-6" />}
              title={ed('concepts.softmax.title')}
              text={ed('concepts.softmax.text')}
              color="text-purple-400"
              bg="bg-purple-500/10"
            />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* SECTION 3: Pipeline */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="mb-20"
      >
        <motion.div variants={fadeIn} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {ed('pipeline.title')}
          </h2>
          <p className="text-gray-400">
            {ed('pipeline.subtitle')}
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: <Pencil className="h-5 w-5" />, key: 'step1', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: <Grid3X3 className="h-5 w-5" />, key: 'step2', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { icon: <TrendingUp className="h-5 w-5" />, key: 'step3', color: 'text-green-400', bg: 'bg-green-500/10' },
            { icon: <Brain className="h-5 w-5" />, key: 'step4', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
            { icon: <BarChart3 className="h-5 w-5" />, key: 'step5', color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { icon: <Target className="h-5 w-5" />, key: 'step6', color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((step, i) => (
            <motion.div key={i} variants={fadeIn}>
              <PipelineStep
                icon={step.icon}
                num={i + 1}
                title={ed(`${step.key}.title`)}
                text={ed(`${step.key}.text`)}
                color={step.color}
                bg={step.bg}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* SECTION 4: Key Concepts */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeIn} className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {ed('keyConcepts.title')}
          </h2>
          <p className="text-gray-400">
            {ed('keyConcepts.subtitle')}
          </p>
        </motion.div>

        <motion.div variants={stagger} className="space-y-3">
          <motion.div variants={fadeIn}>
            <ExpandableCard title={ed('expandable.weights.title')} borderColor="border-l-blue-500">
              {ed('expandable.weights.text')}
            </ExpandableCard>
          </motion.div>
          <motion.div variants={fadeIn}>
            <ExpandableCard title={ed('expandable.loss.title')} borderColor="border-l-orange-500">
              {ed('expandable.loss.text')}
            </ExpandableCard>
          </motion.div>
          <motion.div variants={fadeIn}>
            <ExpandableCard title={ed('expandable.adam.title')} borderColor="border-l-green-500">
              {ed('expandable.adam.text')}
            </ExpandableCard>
          </motion.div>
          <motion.div variants={fadeIn}>
            <ExpandableCard title={ed('expandable.epochs.title')} borderColor="border-l-purple-500">
              {ed('expandable.epochs.text')}
            </ExpandableCard>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}

// -- Helper components --

function Line({ children }) {
  return <div className="text-gray-300 min-h-[1.375rem] whitespace-pre">{children}</div>
}

function AnnotatedLine({ n, children }) {
  return (
    <div className="flex items-center gap-3 text-gray-300 bg-blue-500/5 -mx-5 px-5 border-l-2 border-blue-500/40 min-w-0">
      <span className="flex-1 min-h-[1.375rem] whitespace-pre">{children}</span>
      <Badge n={n} />
    </div>
  )
}

function Kw({ children }) {
  return <span className="text-purple-400">{children}</span>
}
function Fn({ children }) {
  return <span className="text-blue-400">{children}</span>
}
function Str({ children }) {
  return <span className="text-green-400">{children}</span>
}
function Num({ children }) {
  return <span className="text-orange-400">{children}</span>
}

function AnnotationCard({ n, borderColor, title, children }) {
  return (
    <motion.div
      variants={fadeIn}
      className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 border-l-4 ${borderColor}`}
    >
      <div className="flex items-start gap-3">
        <Badge n={n} />
        <div>
          <h4 className="font-semibold text-white text-sm mb-1">{title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{children}</p>
        </div>
      </div>
    </motion.div>
  )
}

function ArchBox({ label, neurons, sub, color, borderColor }) {
  return (
    <div className={`bg-gradient-to-b ${color} border ${borderColor} rounded-xl p-5 text-center min-w-[140px]`}>
      <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-3xl font-bold text-white mb-1">{neurons}</div>
      <div className="text-sm text-gray-300">{sub}</div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex items-center justify-center lg:mx-2 rotate-90 lg:rotate-0">
      <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
      <ChevronRight className="h-4 w-4 text-purple-400 -ml-1" />
    </div>
  )
}

function ConceptCard({ icon, title, text, color, bg }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 h-full">
      <div className={`${bg} ${color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  )
}

function PipelineStep({ icon, num, title, text, color, bg }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 h-full flex flex-col items-center text-center">
      <div className={`${bg} ${color} w-10 h-10 rounded-full flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-xs text-gray-500 mb-1">{num}</div>
      <h4 className="font-semibold text-white text-sm mb-2">{title}</h4>
      <p className="text-gray-500 text-xs leading-relaxed">{text}</p>
    </div>
  )
}
