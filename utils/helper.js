function timeSince(date) {
  const now = new Date();
  const secondsPast = (now.getTime() - date.getTime()) / 1000;
  
  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' sec ago';
  }
  
  const minutesPast = secondsPast / 60;
  
  if (minutesPast < 60) {
    return parseInt(minutesPast) + ' min ago';
  }
  
  const hoursPast = minutesPast / 60;
  
  if (hoursPast < 24) {
    return parseInt(hoursPast) + ' hrs ago';
  }
  
  const daysPast = hoursPast / 24;
  
  if (daysPast < 30) {
    return parseInt(daysPast) + ' days ago';
  }
  
  const monthsPast = daysPast / 30;
  
  if (monthsPast < 12) {
    return parseInt(monthsPast) + ' mo ago';
  }
  
  const yearsPast = daysPast / 365;
  return parseInt(yearsPast) + ' yrs ago';
}

module.exports = {
	timeSince
}