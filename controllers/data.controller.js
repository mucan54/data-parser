const dataAdd = async (req,res) => {

    //şu an kullanılmıyor daha önce başka bir yöntem denemiştim
    const regex_spaces = /((\ )\2{2,})/gm;
    //treleri tespit etmek için
    const regex_dashes = /((\-)\2{2,})/gm;
    //ana obje tespiti
    const colon = /\w+:/gm;


    //son çıktı değişkeni
    var json_element=[];

    //kolonların isimleri
    var json_coloumn=[];

    //ana obje varsa objenin kendi değişkeni
    var colon_arr=[];

    //objenin adı
    var colon_name=[];

    //trelerin boyutu
    var dashes=[];


    //daha önce boşluk bazlı ayırma yapmıştım adı o yüzden o şekilde 
    //şu an tre sayısı kadar satırları ayırıyor
    function dots_spaces(element, json_element, json_coloumn, colon_arr, colon_name,dashes){

        var arr=[];
        //daha önce tre sayısı alınmışsa işleme giriyor
        if(dashes){ 

            //tre sayısına göre elemenlarıı ayırıyor
            arr=dash_parser(dashes,element);

            //eğer ilk elemanı boşsa bilgileri bir önceki elemana ekliyor
            if(arr[0].length==0){
                merge(json_element.pop(),arr,json_element,json_coloumn[0]);
                return;
            }
            else{
            //kolon isimleri ile bilgileri birleştiriyor
                var jarray = {};
                
                for (var i = 0; i < json_coloumn[0].length; i++) {
                    //or check with: if (b.length > i) { assignment }
                    jarray[json_coloumn[0][i]] = arr[i]
                }

                //json dizisine ekleniyor
                json_element.push(jarray);
            
            }
        }
        //eğer tre alınmamışsa direk ekliyor daha sonra düzenleniyor
        else
        json_element.push(element);
    }


    //birleştirme fonksiyonu
    function merge(arr1,arr2,json_element,json_coloumn){

        for (var i = 0; i < json_coloumn.length; i++) {
            //or check with: if (b.length > i) { assignment }
            if(arr2[i]!=''){

                console.log(arr1[json_coloumn[i]]);
                arr1[json_coloumn[i]] = arr1[json_coloumn[i]]+','+arr2[i];
            }
        }
        //en son json dizisine geri konuyor
        json_element.push(arr1);

    }



    //bu fonksiyonda treler arasında birden fazla boşluk varsa
    //bu boşlukları tre ile değiştirmek için çünkü 
    //değişkenler arasında da o kadar boşluk olacak
    function dash_get(dashes){

        String.prototype.replaceAt=function(index, replacement) {
            return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
        }

        for (i = 0; i < dashes.length; i++){
            if(dashes[i]==' '&&dashes[i+1]==' ')
            dashes=dashes.replaceAt(i, "-");

        }

        return dashes;

    }

    //burda da treler alınıyor
    function dots_dashes(element,json_element,json_coloumn, colon_arr, colon_name,dashes){

        dashes.push(dash_get(element).split(' '));

        json_coloumn.push(dash_parser(dashes[0],json_element[[json_element.length-1]]));
        json_element.pop();

    }

    //burda tre sayısına bağlı olarak elemanalr çekiliyor
    function dash_parser(dashes,element){

        function trimStr(str) {
            if(str == null) return str;
            return str.replace(/^\s+|\s+$/g, '');
        }

        var coloumn=[];
        var total=0;
        for (i = 0; i < dashes.length; i++){
            var loopelement;
            if(element[total]==''){
                total++;
                continue;
            }
            if(Array.isArray(element)){
                loopelement=element[0].slice(total,total+dashes[i].length);
                coloumn.push(trimStr(loopelement));
            }
            else{
                loopelement=element.slice(total,total+dashes[i].length);
                coloumn.push(trimStr(loopelement));      
            }
            total+=dashes[i].length+1;
        }
        return coloumn;
    
    }

    
      // data girildiyse
      if (req.body.data) {

        var dataData = unescape(req.body.data).split('\n')


        //her satırın tek tek analizi ve ilgili fonksiyonlara gönderilmesi
        dataData.forEach(function(element) {

            if(element.length<2)
                console.log();
            else if(element.match(regex_dashes))
                dots_dashes(element,json_element,json_coloumn,colon_arr,colon_name,dashes);
            else if(element.match(regex_spaces))
                dots_spaces(element,json_element,json_coloumn,colon_arr,colon_name,dashes[0]);
        
        });
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(json_element);

    } else {
        res.send("data gir")
    }
}




module.exports = {
    dataAdd
}
