Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
Set env = WshShell.Environment("Process")

strPath = WScript.ScriptFullName
strPath = fso.GetParentFolderName(strPath)
projectPath = strPath
serverPath = projectPath & "\server"
vitePath = projectPath & "\node_modules\vite\bin\vite.js"

nodeExe = FindNode()
If nodeExe = "" Then
    MsgBox "Node.js not found. Please install Node.js first.", 48, "Error"
    WScript.Quit
End If

WshShell.CurrentDirectory = serverPath
WshShell.Run """" & nodeExe & """ index.js", 0, False

WScript.Sleep 1500

WshShell.CurrentDirectory = projectPath
WshShell.Run """" & nodeExe & """ """ & vitePath & """", 0, False

For i = 1 To 15
    WScript.Sleep 500
    If CheckPort(5173) Then
        Exit For
    End If
Next

WshShell.Run "http://localhost:5173", 1, False

Function FindNode()
    On Error Resume Next
    
    pathEnv = env("PATH")
    paths = Split(pathEnv, ";")
    
    For Each p In paths
        p = Trim(p)
        If p <> "" Then
            If Right(p, 1) <> "\" Then p = p & "\"
            If fso.FileExists(p & "node.exe") Then
                FindNode = p & "node.exe"
                Exit Function
            End If
        End If
    Next
    
    If fso.FileExists("C:\Program Files\nodejs\node.exe") Then
        FindNode = "C:\Program Files\nodejs\node.exe"
        Exit Function
    End If
    
    If fso.FileExists("C:\Program Files (x86)\nodejs\node.exe") Then
        FindNode = "C:\Program Files (x86)\nodejs\node.exe"
        Exit Function
    End If
    
    FindNode = ""
End Function

Function CheckPort(port)
    On Error Resume Next
    Set http = CreateObject("MSXML2.XMLHTTP")
    http.Open "GET", "http://localhost:" & port, False
    http.Send
    If Err.Number = 0 Then
        CheckPort = True
    Else
        CheckPort = False
    End If
    Err.Clear
End Function
