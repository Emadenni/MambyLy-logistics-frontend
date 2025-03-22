export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
  
    return date.toLocaleDateString("en-US", {
      weekday: "long",   
      month: "long",     
      day: "numeric",   
      year: "numeric",   
    }) + ", " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",   
        minute: "2-digit", 
        second: "2-digit",
      });
  };
  