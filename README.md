# StarWars Geeks · פרויקט גמר

## מה האפליקציה עושה
StarWars Geeks היא אפליקציית Web (בנויה ב-React ו-Vite) המציגה קטלוג דמויות מהיקום של "מלחמת הכוכבים" במבנה Master-Detail[cite: 1]. האפליקציה מאפשרת לצפות ברשימת הדמויות, לסנן אותן בעזרת חיפוש, וללחוץ על כל דמות כדי לראות את הפרטים המלאים שלה. הפרויקט כולל ניהול מצבי רשת (טעינה ושגיאה)[cite: 2].

## Data Source (API)
This project fetches its data from the free, public Star Wars API[cite: 2]:
* **API Endpoint:** `https://swapi.info/api/people`[cite: 4, 6]

## איך מריצים את האפליקציה
```bash
# התקנת כל התלויות (packages)
npm install

# הפעלת שרת הפיתוח המקומי
npm run dev