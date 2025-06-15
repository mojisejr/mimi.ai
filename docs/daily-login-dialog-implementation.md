# Daily Login Dialog Implementation

## Overview

This document describes the implementation of the Daily Login Dialog feature, including its architecture, state management, and UI considerations.

## Table of Contents

- [1. Feature Overview](#1-feature-overview)
- [2. Architecture](#2-architecture)
- [3. State Management](#3-state-management)
- [4. UI Implementation](#4-ui-implementation)
- [5. Usage Guide](#5-usage-guide)
- [6. Testing](#6-testing)

## 1. Feature Overview

### 1.1 Current State

- Dialog shows every time user visits questions page
- No state management for dialog display between days
- State management directly in component

### 1.2 Improved State

- Shows dialog every time if reward not claimed
- Shows dialog once per day if reward claimed
- State management in custom hook
- Uses localStorage for dialog display tracking

## 2. Architecture

### 2.1 Custom Hook Design

```typescript
// src/hooks/use-daily-login.ts
import { useEffect, useState } from "react";
import { getDailyLoginStatus, claimDailyLogin } from "@/actions/daily-login";

export const useDailyLogin = (lineId: string) => {
  // States
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClaiming, setIsClaiming] = useState(false);
  const [status, setStatus] = useState<any>(null);

  // Methods
  const checkStatus = async () => {
    try {
      setIsLoading(true);
      const result = await getDailyLoginStatus(lineId);
      if (result.success) {
        setStatus(result.data);

        if (!result.data?.hasClaimedToday) {
          setShowDialog(true);
        } else {
          const lastShown = localStorage.getItem(`daily_login_shown_${lineId}`);
          const today = new Date().toDateString();

          if (lastShown !== today) {
            setShowDialog(true);
            localStorage.setItem(`daily_login_shown_${lineId}`, today);
          } else {
            setShowDialog(false);
          }
        }
      }
    } catch (error) {
      console.error("Error checking daily login status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (isClaiming) return;

    try {
      setIsClaiming(true);
      const result = await claimDailyLogin(lineId);
      if (result.success) {
        await checkStatus();
        localStorage.setItem(
          `daily_login_shown_${lineId}`,
          new Date().toDateString()
        );
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    localStorage.setItem(
      `daily_login_shown_${lineId}`,
      new Date().toDateString()
    );
  };

  useEffect(() => {
    if (lineId) {
      checkStatus();
    }
  }, [lineId]);

  return {
    showDialog,
    isLoading,
    isClaiming,
    status,
    handleClaim,
    handleClose,
    checkStatus,
  };
};
```

### 2.2 Design Principles

1. **Single Responsibility**

   - Hook manages only daily login logic
   - UI concerns separated from business logic

2. **State Management**

   - Uses React hooks for state
   - Separates state from component

3. **Persistence**
   - Uses localStorage for display tracking
   - Unique keys per user ID

## 3. State Management

### 3.1 localStorage Implementation

```typescript
// Key format
const STORAGE_KEY = `daily_login_shown_${lineId}`;

// Check display status
const lastShown = localStorage.getItem(STORAGE_KEY);
const today = new Date().toDateString();

if (lastShown !== today) {
  setShowDialog(true);
  localStorage.setItem(STORAGE_KEY, today);
} else {
  setShowDialog(false);
}
```

### 3.2 Error Handling

```typescript
try {
  localStorage.setItem(STORAGE_KEY, today);
} catch (error) {
  console.error("Failed to save dialog state:", error);
  // Fallback to showing dialog
  setShowDialog(true);
}
```

## 4. UI Implementation

### 4.1 Component Structure

```typescript
// src/components/daily-login-dialog.tsx
export default function DailyLoginDialog({ lineId }: Props) {
  const {
    showDialog,
    isLoading,
    isClaiming,
    status,
    handleClaim,
    handleClose,
  } = useDailyLogin(lineId);

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60" onClick={handleClose}></div>

      {/* Dialog Container */}
      <div className="relative z-50 w-full max-w-lg mx-4">
        <div className="modal-box bg-gradient-to-br from-primary/90 to-secondary/90 shadow-xl backdrop-blur-sm overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Background effects */}
          </div>

          {/* Content */}
          <div className="relative z-10">{/* Dialog content */}</div>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 UI Considerations

1. **Z-index Management**

   - Backdrop: z-40
   - Dialog container: z-50
   - Background elements: -z-10
   - Content: z-10

2. **Event Handling**
   - Click outside to close
   - Prevent event bubbling
   - Disable buttons during loading

## 5. Usage Guide

### 5.1 Basic Usage

```typescript
// In your page component
import DailyLoginDialog from "@/components/daily-login-dialog";

export default function YourPage() {
  const { profile } = useLine();

  return (
    <div>
      {/* Your page content */}
      {profile?.userId && <DailyLoginDialog lineId={profile.userId} />}
    </div>
  );
}
```

### 5.2 Customization

1. **Styling**

   - Override modal-box classes
   - Custom background effects
   - Custom animations

2. **Behavior**
   - Custom close behavior
   - Custom claim handling
   - Custom status checking

## 6. Testing

### 6.1 Test Cases

1. **Display Logic**

   - Shows when not claimed
   - Shows once per day when claimed
   - Doesn't show when already shown today

2. **Claim Functionality**

   - Successful claim
   - Failed claim
   - Duplicate claim

3. **UI/UX**
   - Button interactions
   - Loading states
   - Animations

### 6.2 Error Cases

1. **API Errors**

   - Network failures
   - Server errors
   - Invalid responses

2. **Storage Errors**
   - Full storage
   - Disabled storage
   - Invalid data

## Best Practices

1. **Code Organization**

   - Keep logic in custom hook
   - Separate UI from business logic
   - Use TypeScript for type safety

2. **Performance**

   - Minimize API calls
   - Use proper caching
   - Optimize re-renders

3. **Security**

   - Validate user ID
   - Sanitize storage data
   - Handle errors gracefully

4. **Maintenance**
   - Document changes
   - Add comments for complex logic
   - Keep dependencies updated
