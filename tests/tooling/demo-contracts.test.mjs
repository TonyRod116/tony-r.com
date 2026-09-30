import test from 'node:test'
import assert from 'node:assert/strict'
import { readDemoResponse, imageUrl } from '../../src/utils/demoResponse.js'
import { parseStructuredResponse } from '../../src/pages/demos/LeadQualifier/utils/scoring.js'

test('demo transport accepts JSON and keeps useful public error messages',async()=>{
  assert.deepEqual(await readDemoResponse(new Response('{"total":900}',{headers:{'Content-Type':'Application/JSON'}}),'Fallback'),{total:900})
  await assert.rejects(readDemoResponse(new Response('{"detail":"Readable error"}',{status:422,headers:{'Content-Type':'application/json'}}),'Fallback'),/Readable error/)
})
test('HTML, malformed and scalar replies never leak diagnostic bodies into the UI',async()=>{
  for(const [body,type]of[['<h1>PRIVATE diagnostic</h1>','text/html'],['bad json','application/json'],['null','application/json'],['[1,2]','application/json']])await assert.rejects(readDemoResponse(new Response(body,{headers:{'Content-Type':type}}),'Safe fallback'),/^Error: Safe fallback$/)
})
test('response image URLs reject executable or credential-bearing schemes',()=>{
  assert.equal(imageUrl('javascript:alert(1)'),null)
  assert.equal(imageUrl('file:///etc/passwd'),null)
  assert.equal(imageUrl('https://user:password@example.test/photo.png'),null)
  assert.equal(imageUrl('/gallery/photo.jpg','https://portfolio.test'),'https://portfolio.test/gallery/photo.jpg')
  assert.equal(imageUrl('data:image/png;base64,AAA'),'data:image/png;base64,AAA')
})
test('lead parsing retains contact data for the interface without logging it',()=>{
  const logs=[],previous=console.log
  console.log=(...args)=>logs.push(args)
  try{
    const parsed=parseStructuredResponse(JSON.stringify({displayText:'Synthetic response',state:{city:'Barcelona',contact_email:'qa-private@example.test',contact_phone:'000000000'},next_action:'continue'}),key=>key)
    assert.equal(parsed.leadFields.contactEmail,'qa-private@example.test')
    assert.equal(parsed.leadFields.contactPhone,'000000000')
    assert.ok(!JSON.stringify(logs).includes('qa-private'))
    assert.equal(logs.length,0)
  }finally{console.log=previous}
})
