class APIFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr
     }
    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i'
            }
        }:{}
        console.log(keyword)
        this.query=this.query.find({...keyword});
        // this.query=this.query.find(keyword);
       
        return this;
    }
    filter(){
        const queryCopy={...this.queryStr};
        // console.log("aaa",queryCopy)
        //removing fields from query
        const removeFields=['keyword','limit','page']
        removeFields.forEach((elem)=>{
            delete queryCopy[elem]
        })
        //Advance filter for price,ratings etc
        let queryStr=JSON.stringify(queryCopy)
        queryStr=queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match=>`$${match}`);
          console.log(queryStr)
        this.query=this.query.find(JSON.parse(queryStr));
        return this
    }
    pagination(resperpage){
            const currentPage=this.queryStr.page || 1;
            // console.log(currentPage)
            const skip=resperpage*(currentPage-1);
            this.query=this.query.limit(resperpage).skip(skip);
            return this;
    }
}
module.exports =APIFeatures;