"use client";
import { useState } from "react";
export default function VideoPoster({id,title}:{id:string;title:string}) {
 const [fallback,setFallback]=useState(false);
 return <img src={`https://i.ytimg.com/vi/${id}/${fallback ? "hqdefault" : "maxresdefault"}.jpg`} alt={title} width="1280" height="720" loading="lazy" onLoad={(e)=>{if(e.currentTarget.naturalWidth < 480 && !fallback)setFallback(true);}} onError={()=>{if(!fallback)setFallback(true);}} />;
}
