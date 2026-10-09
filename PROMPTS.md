# יומן פרומפטים

כל פרומפט שאתם שולחים לסוכן נרשם כאן **אוטומטית** (ראו `README.md`).
אחרי כל משימה, הוסיפו בעצמכם שורה אחת: מה בדקתם, ומה שיניתם בעצמכם.

<!-- הרשומות מתווספות מתחת לשורה הזאת -->
**9/10/26 · 16:30 · copilot**

> Please complete Task 1 from tasks.md. 
> 1. Create a new folder src/data and a file inside it named items.json. Fill it with a mock JSON array of 5 Star Wars characters (include properties like id, name, height, mass, hair_color, birth_year, and gender).
> 2. Create a new folder src/components and a file named CharacterList.jsx.
> 3. In CharacterList.jsx, import the JSON file and create a functional component that renders the list of character names using .map(). Crucially, ensure each list item receives a unique key prop to prevent React console errors.
> 4. Update src/App.jsx by removing the default Vite boilerplate and rendering the new <CharacterList/> component instead.
> Ensure that the list displays correctly and there are absolutely no errors in the browser console.

**16:31 · copilot**

> please update the PROMPTS.md file under line 6 with the task

**סיכום משימה 1:** הסוכן יצר את הקומפוננטות והמידע המקומי. פתחתי את הדפדפן ב-localhost:5173, ראיתי שהרשימה נטענת בהצלחה, ובדקתי ב-DevTools שאין שגיאות אדומות של missing key בקונסול.

**16:34 · copilot**

> Please complete Task 2 from tasks.md: 'Click shows details - state in parent component, props to children'... (rest of prompt 2)

**סיכום משימה 2:** וידאתי שה-state אכן מנוהל ב-App.jsx. בדקתי בדפדפן שכאשר האפליקציה עולה יש הודעה שמבקשת לבחור דמות, ולחיצה על דמות מהרשימה מציגה את הפרטים שלה ברכיב ה-CharacterDetails בעזרת ה-props.

**16:45 · copilot**

> Please complete Task 3 from tasks.md: 'Real fetch - replace local file with API, including loading and error states'... (rest of prompt)

**סיכום משימה 3:** וידאתי שהנתונים מגיעים מה-API של swapi.info דרך useEffect. בדקתי את מצבי הרשת דרך ה-DevTools: ראיתי את מצב הטעינה בהתחלה, וכשניתקתי את הרשת (Offline) קיבלתי הודעת שגיאה במקום מסך לבן.

**21:50 · copilot**

> Please complete Task 4 from tasks.md: 'Search or filter'... (rest of prompt)

**סיכום משימה 4:** בדקתי את שורת החיפוש החדשה בדפדפן. הקלדתי שמות באותיות גדולות וקטנות ווידאתי שהסינון עובד בזמן אמת (case-insensitive) ושהרשימה המלאה חוזרת כשמוחקים את הטקסט.