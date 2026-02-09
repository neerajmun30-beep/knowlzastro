# 🔧 API Integration Fixes - Final Desktop.html

## ❌ ERRORS FOUND

1. **Profile Creation Not Calling Astrology API**: `createProfileFromChat()` saves to localStorage but doesn't call `AstroClient.fetchBirthChart()` to generate chart data
2. **Send Button Missing Event Listener**: `send-btn` button doesn't have explicit click handler - relies on undefined `onclick` attribute
3. **Chat API Calls Not Properly Wired**: `sendMessage()` has multiple fallbacks but may not reach backend `/chat` endpoint
4. **Missing Coordinates Extraction**: Profile creation doesn't extract lat/lon from place of birth before calling API
5. **API Response Not Displayed**: Even if API calls succeed, responses may not be properly displayed in UI
6. **Backend URL Configuration**: May default to wrong URL if `API_CONFIG` not loaded

---

## ✅ FIXES TO APPLY

### Fix 1: Add Event Listener for Send Button

**Location**: Inside `<script>` tag before closing `</body>`

```javascript
// Wire send button click handler
document.addEventListener('DOMContentLoaded', function() {
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    
    if (sendBtn && !sendBtn.hasAttribute('data-wired')) {
        sendBtn.setAttribute('data-wired', 'true');
        
        // Click handler
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.sendMessage === 'function') {
                window.sendMessage();
            } else {
                console.error('sendMessage function not found');
            }
        });
        
        // Enter key handler
        if (chatInput) {
            chatInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (typeof window.sendMessage === 'function') {
                        window.sendMessage();
                    }
                }
            });
        }
        
        console.log('✅ Send button wired');
    }
});
```

### Fix 2: Update `createProfileFromChat()` to Call Astrology API

**Location**: Find function `createProfileFromChat()` around line 3027

**Replace the entire function with:**

```javascript
async function createProfileFromChat() {
    console.log('📋 createProfileFromChat called');
    
    // Get form values
    const name = document.getElementById('chat-profile-name').value.trim();
    const dob = document.getElementById('chat-profile-dob').value.trim();
    const tob = document.getElementById('chat-profile-tob').value.trim();
    const pob = document.getElementById('chat-profile-pob').value.trim();
    const gender = document.getElementById('chat-profile-gender').value;
    const email = document.getElementById('chat-profile-email').value.trim();
    const mobile = document.getElementById('chat-profile-mobile').value.trim();
    
    // Validate required fields
    if (!name || !dob || !tob || !pob || !email || !mobile) {
        alert('Please fill all required fields (Name, DOB, TOB, POB, Email, Mobile)');
        return;
    }
    
    // Validate date format (DD/MM/YYYY)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!dateRegex.test(dob)) {
        alert('Please enter date in DD/MM/YYYY format (e.g., 15/01/1990)');
        return;
    }
    
    // Validate mobile number
    const mobileRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
        alert('Please enter a valid mobile number');
        return;
    }
    
    // Show loading state
    const createBtn = document.getElementById('chat-create-profile-btn');
    if (createBtn) {
        createBtn.disabled = true;
        createBtn.textContent = 'Creating Profile...';
    }
    
    try {
        // Step 1: Get coordinates from place of birth
        console.log('📍 Getting coordinates for:', pob);
        let coords = { lat: null, lon: null, tz: 'Asia/Kolkata' };
        
        if (typeof getCoordinatesFromPlace === 'function') {
            try {
                coords = await getCoordinatesFromPlace(pob);
                console.log('✅ Coordinates found:', coords);
            } catch (coordError) {
                console.warn('⚠️ Could not get coordinates, using defaults:', coordError);
                // Use default coordinates for India if lookup fails
                coords = { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' };
            }
        } else {
            console.warn('⚠️ getCoordinatesFromPlace function not found, using defaults');
            coords = { lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' };
        }
        
        if (!coords.lat || !coords.lon) {
            throw new Error('Could not determine coordinates for place of birth');
        }
        
        // Step 2: Call Astrology API to generate chart
        console.log('🔮 Calling astrology API to generate chart...');
        let chartData = null;
        
        if (typeof window.AstroClient !== 'undefined' && typeof window.AstroClient.fetchBirthChart === 'function') {
            try {
                // Convert date format from DD/MM/YYYY to YYYY-MM-DD for API
                const [day, month, year] = dob.split('/');
                const apiDob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                
                chartData = await window.AstroClient.fetchBirthChart({
                    dob: apiDob,
                    tob: tob,
                    lat: parseFloat(coords.lat),
                    lon: parseFloat(coords.lon),
                    tz: coords.tz || 'Asia/Kolkata'
                });
                
                console.log('✅ Chart data received from API:', chartData);
            } catch (apiError) {
                console.error('❌ Astrology API error:', apiError);
                // Continue without chart data - user can still use the app
                console.warn('⚠️ Continuing without chart data');
            }
        } else {
            console.warn('⚠️ AstroClient not available');
        }
        
        // Step 3: Save profile to localStorage
        const userId = email || mobile || `user_${Date.now()}`;
        const profile = {
            id: `profile_${userId}_${Date.now()}`,
            userId: userId,
            name: name,
            dob: dob,
            tob: tob,
            pob: pob,
            gender: gender,
            email: email,
            mobile: mobile,
            latitude: coords.lat,
            longitude: coords.lon,
            timezone: coords.tz,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const userProfileKey = `user_profile_${email || mobile}`;
        localStorage.setItem(userProfileKey, JSON.stringify(profile));
        localStorage.setItem('user_profile', JSON.stringify(profile));
        
        // Step 4: Update session memory with birth details and chart data
        const sessionMemory = JSON.parse(localStorage.getItem('session_memory') || '{}');
        sessionMemory.dateOfBirth = dob;
        sessionMemory.timeOfBirth = tob;
        sessionMemory.placeOfBirth = pob;
        sessionMemory.userId = userId;
        sessionMemory.email = email;
        sessionMemory.mobile = mobile;
        sessionMemory.latitude = coords.lat;
        sessionMemory.longitude = coords.lon;
        sessionMemory.timezone = coords.tz;
        sessionMemory.questionCount = 0;
        sessionMemory.paymentCredits = 0;
        sessionMemory.firstQuestionFree = false;
        
        // Store chart data if available
        if (chartData) {
            sessionMemory.chartData = chartData;
            console.log('✅ Chart data stored in session memory');
        }
        
        localStorage.setItem('session_memory', JSON.stringify(sessionMemory));
        
        // Update global sessionMemory
        if (window.sessionMemory) {
            Object.assign(window.sessionMemory, sessionMemory);
        }
        
        // Step 5: Store marketing data
        const marketingData = {
            email: email,
            mobile: mobile,
            name: name,
            profileCreated: new Date().toISOString(),
            source: 'profile_creation',
            birthDetails: { dob, tob, pob, gender },
            lastActivity: new Date().toISOString()
        };
        
        let marketingDataArray = JSON.parse(localStorage.getItem('marketing_data') || '[]');
        const existingIndex = marketingDataArray.findIndex(u => u.email === email || u.mobile === mobile);
        if (existingIndex >= 0) {
            marketingDataArray[existingIndex] = { ...marketingDataArray[existingIndex], ...marketingData };
        } else {
            marketingDataArray.push(marketingData);
        }
        localStorage.setItem('marketing_data', JSON.stringify(marketingDataArray));
        
        // Step 6: Update currentUser
        if (!currentUser) {
            currentUser = { email, mobile, name };
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        }
        
        // Step 7: Hide profile section and show chat
        const chatProfileSection = document.getElementById('chat-profile-section');
        const chatMessages = document.getElementById('chat-messages');
        const chatInputContainer = document.getElementById('chat-input-container');
        
        if (chatProfileSection) chatProfileSection.style.display = 'none';
        if (chatMessages) chatMessages.style.display = 'flex';
        if (chatInputContainer) chatInputContainer.style.display = 'flex';
        
        // Step 8: Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'message ai-message';
        successDiv.innerHTML = `
            <div class="message-avatar">⚫</div>
            <div class="message-content">
                <p><strong>✅ Profile Created Successfully!</strong></p>
                <p>Welcome, <strong>${name}</strong>! Your profile has been saved.</p>
                ${chartData ? '<p>✅ Your birth chart has been generated!</p>' : '<p>⚠️ Chart generation pending - you can still ask questions</p>'}
                <p>🎉 <strong>Your first question is FREE!</strong></p>
                <p><strong>Pricing after first question:</strong></p>
                <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                    <li>₹${PER_QUESTION_TOTAL} per question (₹${PER_QUESTION_PRICE} + ₹${PER_QUESTION_TOTAL - PER_QUESTION_PRICE} GST)</li>
                    <li>Minimum deposit: ₹${MINIMUM_DEPOSIT} (covers ${QUESTIONS_PER_DEPOSIT} questions)</li>
                </ul>
                <p>Now you can ask me your first question about astrology. What would you like to know?</p>
            </div>
        `;
        if (chatMessages) {
            chatMessages.appendChild(successDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
        }, 300);
        
    } catch (error) {
        console.error('❌ Profile creation error:', error);
        alert('Error creating profile: ' + error.message);
    } finally {
        if (createBtn) {
            createBtn.disabled = false;
            createBtn.textContent = '✨ Create Profile & Start Chat';
        }
    }
}
```

### Fix 3: Ensure `sendMessage()` Calls Backend Chat API

**Location**: Find function `sendMessage()` around line 3328

**Add this at the beginning of the AI response generation section (after payment checks, around line 3447):**

```javascript
// PRIORITY: Try backend /chat endpoint first
if (typeof window.AstroClient !== 'undefined' && typeof window.AstroClient.chatProxy === 'function') {
    try {
        console.log('📡 Trying backend /chat endpoint...');
        const sessionId = currentSessionMemory.userId || `session_${Date.now()}`;
        const chatResponse = await window.AstroClient.chatProxy(
            [{ role: 'user', content: message }],
            'gpt-4o-mini' // or use model from config
        );
        
        if (chatResponse && chatResponse.response) {
            console.log('✅ Backend chat response received');
            response = chatResponse.response;
        }
    } catch (chatError) {
        console.warn('⚠️ Backend /chat failed, trying fallbacks:', chatError.message);
    }
}

// If backend didn't work, continue with existing fallback logic...
```

### Fix 4: Add Missing HTML Attribute

**Location**: Find the send button around line 2113

**Change from:**
```html
<button id="send-btn" class="send-btn">Send</button>
```

**To:**
```html
<button id="send-btn" class="send-btn" type="button">Send</button>
```

---

## 📋 SUMMARY OF CHANGES

1. ✅ Added event listener for send button (click + Enter key)
2. ✅ Updated `createProfileFromChat()` to:
   - Extract coordinates from place of birth
   - Call `AstroClient.fetchBirthChart()` to generate chart
   - Store chart data in session memory
   - Show success message with chart status
3. ✅ Enhanced `sendMessage()` to prioritize backend `/chat` endpoint
4. ✅ Added `type="button"` to send button to prevent form submission

---

## 🔧 HOW TO APPLY

1. Open `final desktop.html`
2. Find each section mentioned above
3. Replace with the provided code
4. Save and test

---

## ✅ VERIFICATION

After applying fixes:
1. Create profile → Should call astrology API and generate chart
2. Send message → Should call backend `/chat` endpoint
3. Check browser console for API calls
4. Check server console for received requests

