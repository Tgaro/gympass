const fim = '59:59.999'

console.log(Date.parse(`01/01/1999 00:${fim}`, 'dd/MM/yyyy hh:mm:ss.sss'), Date.parse(`01/01/1999 00:11:03.170`))

if(Date.parse(`01/01/1999 00:1:02.852`) > Date.parse(`01/01/1999 00:11:03.170`)){
	console.log(true)
}else{
	console.log(false)
}