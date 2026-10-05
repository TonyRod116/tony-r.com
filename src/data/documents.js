import cvPdfEn from '../assets/Tony_Rodriguez_CV_EN_Final.pdf'
import cvPdfEs from '../assets/Tony_Rodriguez_CV_ES_Final.pdf'
import cvThumbnail from '../assets/CV_EN_thumb.png'
import cvThumbnailEs from '../assets/CV_ES_thumb.png'
import harvardPdf from '../assets/CS50_Harvard_AI.pdf'
import harvardThumbnail from '../assets/Harvard_AI.png'
import gaPdf from '../assets/General_Assembly.pdf'
import gaThumbnail from '../assets/GA.png'
import advancedPdf from '../assets/Stanford_ML_ Advanced_Algos.pdf'
import supervisedPdf from '../assets/Stanford_ML_ Supervised_Learning.pdf'
import unsupervisedPdf from '../assets/Stanford_ML_ Unsupervised_Learning.pdf'
import specializationPdf from '../assets/ML_Specialization.pdf'
import advancedThumbnail from '../assets/Stanford_Advanced_thumb.png'
import supervisedThumbnail from '../assets/Stanford_Supervised_thumb.png'
import unsupervisedThumbnail from '../assets/Stanford_Unsupervised_thumb.png'
import specializationThumbnail from '../assets/ML_Spec_thumb.png'

export const cvDocuments = {
  es: { id:'cv-es',pdf:cvPdfEs,thumbnail:cvThumbnailEs,title:'CV · Español' },
  en: { id:'cv-en',pdf:cvPdfEn,thumbnail:cvThumbnail,title:'CV · English' },
}
export const certificateDocuments = [
  {id:'ga',pdf:gaPdf,thumbnail:gaThumbnail},
  {id:'specialization',pdf:specializationPdf,thumbnail:specializationThumbnail},
  {id:'harvard',pdf:harvardPdf,thumbnail:harvardThumbnail},
  {id:'advanced',pdf:advancedPdf,thumbnail:advancedThumbnail},
  {id:'supervised',pdf:supervisedPdf,thumbnail:supervisedThumbnail},
  {id:'unsupervised',pdf:unsupervisedPdf,thumbnail:unsupervisedThumbnail},
]
