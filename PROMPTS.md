# יומן פרומפטים

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

> Please complete Task 2 from tasks.md: 'Click shows details - state in parent component, props to children'.
>
> 1. In src/App.jsx, add a state variable called selectedCharacter (initially null).
> 2. Create a new file src/components/CharacterDetails.jsx. This functional component should receive the character object as a prop and display their details: name, height, mass, hair_color, birth_year, and gender. If the character prop is null, it should display a placeholder message like 'Select a character to see their details'.
> 3. Update src/components/CharacterList.jsx to accept an onSelectCharacter prop. Ensure that clicking on a character's name in the list calls this function, passing the specific character object.
> 4. Update src/App.jsx to render both <CharacterList> (passing the onSelectCharacter function) and <CharacterDetails> (passing the selectedCharacter state). They should be displayed side-by-side or one above the other.

**סיכום משימה 2:** וידאתי שה-state אכן מנוהל ב-App.jsx. בדקתי בדפדפן שכאשר האפליקציה עולה יש הודעה שמבקשת לבחור דמות, ולחיצה על דמות מהרשימה מציגה את הפרטים שלה ברכיב ה-CharacterDetails בעזרת ה-props.

**16:45 · copilot**

> Please complete Task 3 from tasks.md: 'Real fetch - replace local file with API, including loading and error states'.
>
> 1. In src/App.jsx, remove any usage of the local items.json mock data.
> 2. Add new state variables: characters (array), isLoading (boolean, default true), and error (string or null).
> 3. Use the useEffect hook to fetch data exactly from this endpoint: [https://swapi.info/api/people](https://swapi.info/api/people).
> 4. Inside the fetch promise/async function, update the characters state with the retrieved data, and set isLoading to false. Catch any network errors, set a clear error message in the error state, and set isLoading to false.
> 5. Update the UI in App.jsx: if isLoading is true, return a simple 'Loading...' message. If error has a value, return an error message. > Otherwise, render the application normally with the fetched characters.

**סיכום משימה 3:** וידאתי שהנתונים מגיעים מה-API של swapi.info דרך useEffect. בדקתי את מצבי הרשת דרך ה-DevTools: ראיתי את מצב הטעינה בהתחלה, וכשניתקתי את הרשת (Offline) קיבלתי הודעת שגיאה במקום מסך לבן.

**21:50 · copilot**

> Please complete Task 4 from tasks.md: 'Search or filter'.
>
> 1. Create a new component src/components/SearchBar.jsx that renders an <input> field for searching. It should receive searchQuery and onSearchChange as props.
> 2. In src/App.jsx, add a new state variable called searchQuery (initialized as an empty string).
> 3. Render the <SearchBar> component in App.jsx above the <CharacterList>, passing the searchQuery state and its setter function.
> 4. In App.jsx, compute a filteredCharacters array by filtering the characters state. It should only include characters whose name contains the searchQuery (make it case-insensitive).
> 5. Pass filteredCharacters to <CharacterList> instead of the original characters array.

**סיכום משימה 4:** בדקתי את שורת החיפוש החדשה בדפדפן. הקלדתי שמות באותיות גדולות וקטנות ווידאתי שהסינון עובד בזמן אמת (case-insensitive) ושהרשימה המלאה חוזרת כשמוחקים את הטקסט.

**22:00 · copilot**

> Please complete Task 5 from tasks.md: 'Design'.
>
> 1. Create a responsive and modern CSS design for the StarWars Geeks app.
> 2. Add styling in src/App.css (or relevant CSS files) to ensure a great layout on both wide screens (desktop) and narrow screens (mobile). Use Flexbox or CSS Grid.
> 3. Make the UI visually appealing, maybe with a dark Star Wars-inspired theme.
> 4. Ensure all components (App, SearchBar, CharacterList, CharacterDetails) have proper CSS classes and structured styling.

**סיכום משימה 5:** הסוכן הוסיף קובצי CSS ועיצוב לאפליקציה. בדקתי בדפדפן שהעיצוב נראה טוב וקריא. בנוסף, הקטנתי את חלון הדפדפן וראיתי שהתצוגה רספונסיבית (מתאימה למובייל) והאלמנטים לא נחתכים אלא מסתדרים בהתאם לגודל המסך.

**10/10/26 · 10:58 · copilot**

> Please complete Task 6 from tasks.md: 'Save favorites to localStorage (Bonus)'.
>
> 1. In src/App.jsx, add a new state called favorites (an array). Initialize it by reading from localStorage (e.g., JSON.parse(localStorage.getItem('sw_favorites')) || []).
> 2. Add a useEffect in App.jsx that listens to changes in the favorites state and saves the updated array to localStorage (localStorage.setItem(...)).
> 3. Create a toggleFavorite(characterName) function in App.jsx that adds the character to the favorites array if it's not there, or removes it if it is.
> 4. Pass the favorites array and the toggleFavorite function as props to <CharacterList> and <CharacterDetails>.
> 5. Update the UI to include a 'Favorite' button (or a Star icon) next to the character's name (either in the list or the details view). > Visually indicate whether the character is currently a favorite (e.g., filled star vs empty star).

**סיכום משימה 6:** בדקתי את מנגנון המועדפים: סימנתי מספר דמויות עם כפתור המועדפים, ורעננתי את הדף (F5). וידאתי שהדמויות שסימנתי נשארות מודגשות כמועדפות גם אחרי הרענון, מה שמאשר שהשמירה ל-localStorage עובדת בצורה תקינה.

**11:18 · copilot**

> Please complete Task 7 from tasks.md: 'Show favorites list'.
>
> 1. In src/App.jsx, add a new state called showFavoritesOnly (boolean, default false).
> 2. Add a UI element (like a toggle button or a checkbox) above the character list, near the SearchBar, to toggle showFavoritesOnly between true and false. Label it something like 'Show Favorites'.
> 3. Update the filtering logic for the filteredCharacters array: if showFavoritesOnly is true, the list should ONLY include characters that are present in the favorites array.
> 4. Ensure this new filter works together with the existing searchQuery (e.g., if a user searches for 'Luke' while 'Show Favorites' is active, it should only show favorited characters containing 'Luke').

**סיכום משימה 7:** בדקתי את כפתור סינון המועדפים. הפעלתי אותו וראיתי שהרשימה מציגה אך ורק את הדמויות שסימנתי קודם כמועדפות. כמו כן, בדקתי הקלדה בשורת החיפוש כשהסינון פעיל, ווידאתי ששני הסינונים (מועדפים + טקסט) עובדים יחד בצורה תקינה.